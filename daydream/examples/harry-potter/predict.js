const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
var daydream = require('daydream-node')();

const express = require('express');
const app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http);

let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['expelliarmus', 'lumos'];

app.use(express.static(__dirname + '/front-end'))

io.on('connection', async function(socket){
    model = await tf.loadLayersModel('file://model/model.json');

    getDaydreamData(socket);
});

const getDaydreamData = (socket) => {
    daydream.onStateChange(function(data){
        if(data.isClickDown){
            predictionDone = false;
            if(liveData.length < 300){
                liveData.push(data.xAcc, data.yAcc, data.zAcc, data.xGyro, data.yGyro, data.zGyro)
            }
        } else {
            if(!predictionDone && liveData.length){
                predictionDone = true;
                predict(model, liveData,socket);
                liveData = [];
            }
        }
    });
}

const predict = (model, newSampleData,socket) => {
    tf.tidy(() => {
        const inputData = newSampleData;
        const input = tf.tensor2d([inputData], [1, 300]);
        const predictOut = model.predict(input);
        const winner = gestureClasses[predictOut.argMax(-1).dataSync()[0]];

        switch(winner){
            case 'lumos':
                socket.emit('gesture', 'lumos');
                break;
            case 'expelliarmus':
                socket.emit('gesture', 'expelliarmus');
                break;
            default:
                break;
        }
    });
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});