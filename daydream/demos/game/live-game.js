const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
var daydream = require('daydream-node')();

const robot = require('robotjs');

let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['hadoken', 'punch', 'uppercut'];

const init = async () => {
    model = await tf.loadLayersModel('file://model-game/model.json');

    getDaydreamData();
}

const getDaydreamData = () => {
    daydream.onStateChange(function(data){
        if(data.isClickDown){
            predictionDone = false;
            if(liveData.length < 300){
                liveData.push(data.xAcc, data.yAcc, data.zAcc, data.xGyro, data.yGyro, data.zGyro)
            }
        } else {
            if(!predictionDone && liveData.length){
                predictionDone = true;
                predict(model, liveData);
                liveData = [];
            }
        }
    });
}

const predict = (model, newSampleData) => {
    tf.tidy(() => {
        const inputData = newSampleData;
        const input = tf.tensor2d([inputData], [1, 300]);
        const predictOut = model.predict(input);
        const logits = Array.from(predictOut.dataSync());
        const winner = gestureClasses[predictOut.argMax(-1).dataSync()[0]];
    
        console.log("GESTURE: ", winner);

        switch(winner){
            case 'hadoken':
                robot.typeString('s');
                break;
            case 'punch':
                robot.typeString('a');
                break;
            case 'uppercut':
                robot.typeString('d');
                break;
        }
    });
}

init();