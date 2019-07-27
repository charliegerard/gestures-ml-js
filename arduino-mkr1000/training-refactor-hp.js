const fs = require("fs");
const lineReader = require("line-reader");
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const gestureClasses = ["alohomora", "expelliarmus"];
// const gestureClasses = ["cross", "square", "triangle"];
let justFeatures = [];
let justLabels = [];
let numClasses = gestureClasses.length;

function read(filename) {
    const data = [];
    return new Promise((resolve, reject) => {
        // read each line of each file and return object with label and features
        lineReader.eachLine(`data/arduino/${filename}`, function (line) {
            // Remove 'START' and 'END'
            const truncatedLine = line.substr(line.indexOf('START ') + 6, line.indexOf('END') - 7);
            // Convert string line to line of float values
            const convertedData = truncatedLine.split(" ").map(item => parseFloat(item));
            // push all that stuff into an array
            data.push(convertedData);
            // i don't remember why i do that
            const concatArray = data.reduce((acc, val) => acc.concat(val), []);

            // To make sure the data has the same format everywhere, we only take the 300 first values
            if (concatArray.length === 882) { // 6 values per line for 147 lines
                let trimmedLabel = filename.split("_")[1];
                let trimmedLabelIndex;
                gestureClasses.map((gesture, index) =>
                    gesture === trimmedLabel ? (trimmedLabelIndex = index) : undefined
                );
                return resolve({ features: concatArray, label: trimmedLabelIndex });
            }
        });
    });
}

function getFilenames() {
    return new Promise((resolve, reject) => {
        fs.readdir(`data/arduino`, "utf8", (err, data) =>
            err ? reject(err) : resolve(data)
        );
    });
}

function format(data) {
    // to make it easier to deal with only features, we reformat
    gestureClasses.map(function () {
        justFeatures.push([]);
        justLabels.push([]);
    });

    data.map(function (item) {
        justFeatures[item.label].push(item.features);
        justLabels[item.label].push(item.label);
    });

    return transformToTensor(justFeatures, justLabels);
}

const transformToTensor = (features, labels) => {
    return tf.tidy(() => {
        const xTrains = [];
        const yTrains = [];
        const xTests = [];
        const yTests = [];
        for (let i = 0; i < gestureClasses.length; ++i) {
            const [xTrain, yTrain, xTest, yTest] =
                convertToTensors(features[i], labels[i], 0.20); // create tensors from our data
            xTrains.push(xTrain);
            yTrains.push(yTrain);
            xTests.push(xTest);
            yTests.push(yTest);
        }

        const concatAxis = 0;

        // Concat all training labels together, all training features, all test labels and all test features
        return [
            tf.concat(xTrains, concatAxis), tf.concat(yTrains, concatAxis),
            tf.concat(xTests, concatAxis), tf.concat(yTests, concatAxis)
        ];
    })
}


function convertToTensors(data, targets, testSplit) {
    const numExamples = data.length;
    if (numExamples !== targets.length) {
        throw new Error('data and split have different numbers of examples');
    }

    // Randomly shuffle `data` and `targets`.
    const indices = [];
    for (let i = 0; i < numExamples; ++i) {
        indices.push(i);
    }
    tf.util.shuffle(indices);

    const shuffledData = [];
    const shuffledTargets = [];
    for (let i = 0; i < numExamples; ++i) {
        shuffledData.push(data[indices[i]]);
        shuffledTargets.push(targets[indices[i]]);
    }

    // Split the data into a training set and a tet set, based on `testSplit`.
    const numTestExamples = Math.round(numExamples * testSplit);
    const numTrainExamples = numExamples - numTestExamples;

    const xDims = shuffledData[0].length;

    const xs = tf.tensor2d(shuffledData, [numExamples, xDims]);

    // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
    // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
    const ys = tf.oneHot(tf.tensor1d(shuffledTargets).toInt(), numClasses);

    const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
    const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
    const yTrain = ys.slice([0, 0], [numTrainExamples, numClasses]);
    const yTest = ys.slice([0, 0], [numTestExamples, numClasses]);
    return [xTrain, yTrain, xTest, yTest];
}

const createModel = async (xTrain, yTrain, xTest, yTest) => {
    const params = { learningRate: 0.1, epochs: 40 };
    // Define the topology of the model: two dense layers.
    const model = tf.sequential();
    model.add(tf.layers.dense(
        { units: 10, activation: 'sigmoid', inputShape: [xTrain.shape[1]] }));
    model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));
    model.summary();

    const optimizer = tf.train.adam(params.learningRate);
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    const trainLogs = [];

    await model.fit(xTrain, yTrain, {
        epochs: params.epochs,
        validationData: [xTest, yTest],
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                // Plot the loss and accuracy values at the end of every training epoch.
                trainLogs.push(logs);
            },
        }
    });
    await model.save('file://model-hp');
    return model;
}

(async () => {
    // get all filenames in data folder
    const filenames = await getFilenames();
    // get all data from each file in data folder
    const allData = filenames.map(async filename => {
        const originalContent = await read(filename);
        return originalContent;
    });
    const gesturesData = await Promise.all(allData);

    const formattedArray = format(gesturesData);
    const model = await createModel(formattedArray[0], formattedArray[1], formattedArray[2], formattedArray[3]);

    const prediction = model.predict(formattedArray[0]);
    const logits = Array.from(prediction.dataSync());
    const winner = gestureClasses[prediction.argMax(-1).dataSync()[0]];
    console.log(winner)
})();
