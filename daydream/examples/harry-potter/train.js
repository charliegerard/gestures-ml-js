const lineReader = require('line-reader');
var fs = require('fs');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const newData = require('./formatNewSampleHp');

let allData = [];
let justFeatures = [];
let justLabels = [];
const gestureClasses = ['alohomora', 'expelliarmus'];

let numClasses = gestureClasses.length;
let numFiles = 24;
let linesPerFile = 50;
let numPointsOfData = 6;
let totalDataPerFile = linesPerFile * numPointsOfData;

function readFile(file) {
  let trimmedContent = [];

  return new Promise((resolve, reject) => {
    fs.readFile(`data/hp/${file}`, "utf8", (err, data) => {
      if (err){
        reject(err);
      } else{ 
        lineReader.eachLine(`./data/hp/${file}`, function(line) {  
          let truncatedLine = line.substr(line.indexOf('START ') + 6, line.indexOf('END')-7);
          let arrayFromLine = truncatedLine.split(" ");
          let formattedLine = arrayFromLine.map(arrayItem => parseFloat(arrayItem));
          trimmedContent.push(formattedLine);

          let concatArray = trimmedContent.reduce((acc, val) => acc.concat(val), []);

          if(concatArray.length === totalDataPerFile){
            let trimmedLabel = file.split("_")[1];
            let trimmedLabelIndex;
            gestureClasses.map((gesture, index) => gesture === trimmedLabel ? trimmedLabelIndex = index : undefined);
            resolve({features: concatArray, label: trimmedLabelIndex })
          }
        });
      } 
    });
  });
}

const readDir = () => 
    new Promise((resolve, reject) => fs.readdir(`./data/hp/`, "utf8", (err, data) => err ? reject(err) : resolve(data)));

(async () => {
  const filenames = await readDir();

  let sortedFilenames = filenames.sort((a, b) => (a > b) ? 1 : -1)

  sortedFilenames.map(async file => { // 75 times
    let originalContent = await readFile(file); 
    allData.push(originalContent);
    if(allData.length === numFiles){ // numFiles
      split(allData)
    }
  })
})();

const split = (allData) => {
  let sortedData = allData.sort((a, b) => (a.label > b.label) ? 1 : -1);

  format(sortedData);
}

const format = data => {
  gestureClasses.map(() => {
    justFeatures.push([]);
    justLabels.push([])
  });

  data.map(item => {
    justFeatures[item.label].push(item.features)
    justLabels[item.label].push(item.label);
  })

  const dataReady = transformToTensor(justFeatures, justLabels);

  createModel(dataReady[0], dataReady[1], dataReady[2], dataReady[3]);
}

const transformToTensor = (features, labels) => {
  return tf.tidy(() => {
    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    for (let i = 0; i < gestureClasses.length; ++i) {
      const [xTrain, yTrain, xTest, yTest] =
          convertToTensors(features[i], labels[i], 0.20);
      xTrains.push(xTrain);
      yTrains.push(yTrain);
      xTests.push(xTest);
      yTests.push(yTest);
    }

    const concatAxis = 0;
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

const createModel = async(xTrain, yTrain, xTest, yTest) => {
  const params = {learningRate: 0.1, epochs: 40};
  // Define the topology of the model: two dense layers.
  const model = tf.sequential();
  model.add(tf.layers.dense(
      {units: 10, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
  model.add(tf.layers.dense({units: numClasses, activation: 'softmax'}));
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
  
  let newSampleData = await newData();

  predict(model, newSampleData);
  await model.save('file://model');
  return model;
}

const predict = (model, newSampleData) => {
  tf.tidy(() => {
    const inputData = newSampleData;
    const input = tf.tensor2d([inputData], [1, totalDataPerFile]);

    const predictOut = model.predict(input);
    const logits = Array.from(predictOut.dataSync());
    const winner = gestureClasses[predictOut.argMax(-1).dataSync()[0]];

    console.log("WINNER", winner);
  });
}

