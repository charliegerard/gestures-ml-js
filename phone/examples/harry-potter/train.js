const lineReader = require('line-reader');
var fs = require('fs');
const tf = require('@tensorflow/tfjs-node');

let justFeatures = [];
let justLabels = [];
const gestureClasses = ['expelliarmus', 'lumos'];
let numClasses = gestureClasses.length;

let numSamplesPerGesture = 21;
let totalNumDataFiles = numSamplesPerGesture * numClasses;
let numPointsOfData = 6;
let numLinesPerFile = 50;
let totalNumDataPerFile = numPointsOfData * numLinesPerFile;

function readFile(file) {
  let allFileData = [];

  return new Promise((resolve, reject) => {
    fs.readFile(`data/hp/${file}`, "utf8", (err, data) => {
      if (err){
        reject(err);
      } else{ 
        lineReader.eachLine(`data/hp/${file}`, function(line) {  
          let dataArray = line.split(" ").map(arrayItem => parseFloat(arrayItem));
          allFileData.push(...dataArray);
          let concatArray = [...allFileData];

          if(concatArray.length === totalNumDataPerFile){
            let label = file.split("_")[1];
            let labelIndex = gestureClasses.indexOf(label)
            resolve({features: concatArray, label: labelIndex })
          }
        });
      } 
    });
  });
}

const readDir = () => 
    new Promise((resolve, reject) => fs.readdir(`data/hp/`, "utf8", (err, data) => err ? reject(err) : resolve(data)));

(async () => {
  const filenames = await readDir();
  let allData = [];
  filenames.map(async file => { // 75 times
    let originalContent = await readFile(file); 
    allData.push(originalContent);
    if(allData.length === totalNumDataFiles){
      format(allData)
    }
  })
})();

const format = (allData) => {
  // sort all data by label to get [{label: 0, features: ...}, {label: 1, features: ...}];
  let sortedData = allData.sort((a, b) => (a.label > b.label) ? 1 : -1);

  sortedData.map(item => {
    createMultidimentionalArrays(justLabels, item.label, item.label);
    createMultidimentionalArrays(justFeatures, item.label, item.features);
  })
  
  const [trainingFeatures, trainingLabels, testingFeatures, testingLabels] = transformToTensor(justFeatures, justLabels);

  createModel(trainingFeatures, trainingLabels, testingFeatures, testingLabels);
}

function createMultidimentionalArrays(dataArray, index, item){
  !dataArray[index] && dataArray.push([]);

  dataArray[index].push(item);
}

const transformToTensor = (features, labels) => { 
  return tf.tidy(() => {
    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    for (let i = 0; i < gestureClasses.length; ++i) {
      const [xTrain, yTrain, xTest, yTest] = convertToTensors(features[i], labels[i], 0.20);
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

function convertToTensors(featuresData, labelData, testSplit) {
  if (featuresData.length !== labelData.length) {
    throw new Error('features set and labels set have different numbers of examples');
  }

  const [shuffledFeatures, shuffledLabels] = shuffleData(featuresData, labelData);

  const featuresTensor = tf.tensor2d(shuffledFeatures, [numSamplesPerGesture, totalNumDataPerFile]);

  // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
  // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
  const labelsTensor = tf.oneHot(tf.tensor1d(shuffledLabels).toInt(), numClasses);

  return split(featuresTensor, labelsTensor, testSplit);
}

const shuffleData = (features, labels) => {
  const indices = [...Array(numSamplesPerGesture).keys()];
  tf.util.shuffle(indices);

  const shuffledFeatures = [];
  const shuffledLabels = [];

  features.map((featuresArray, index) => {
    shuffledFeatures.push(features[indices[index]])
    shuffledLabels.push(labels[indices[index]]);
  })

  return [shuffledFeatures, shuffledLabels];
}

const split = (featuresTensor, labelsTensor, testSplit) => {
  // Split the data into a training set and a test set, based on `testSplit`.
  const numTestExamples = Math.round(numSamplesPerGesture * testSplit);
  const numTrainExamples = numSamplesPerGesture - numTestExamples;

  const trainingFeatures = featuresTensor.slice([0, 0], [numTrainExamples, totalNumDataPerFile]);
  const testingFeatures = featuresTensor.slice([numTrainExamples, 0], [numTestExamples, totalNumDataPerFile]);
  const trainingLabels = labelsTensor.slice([0, 0], [numTrainExamples, numClasses]);

  // was [0,0] and still worked....
  // const testingLabels = labelsTensor.slice([0, 0], [numTestExamples, numClasses]);
  const testingLabels = labelsTensor.slice([numTrainExamples, 0], [numTestExamples, numClasses]);

  return [trainingFeatures, trainingLabels, testingFeatures, testingLabels];
}

const createModel = async(xTrain, yTrain, xTest, yTest) => {
  const params = {learningRate: 0.1, epochs: 40};
  // Define the topology of the model: two dense layers.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 10, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
  model.add(tf.layers.dense({units: numClasses, activation: 'softmax'}));
  model.summary();

  const optimizer = tf.train.adam(params.learningRate);
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  await model.fit(xTrain, yTrain, {
    epochs: params.epochs,
    validationData: [xTest, yTest],
  });
  
  await model.save('file://model');
  return model;
}