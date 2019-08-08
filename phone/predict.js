const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const express = require('express');
const app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http);

let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['punch', 'hadoken', 'uppercut'];

app.use('/predict', express.static(__dirname + '/public/mobile/'));

io.on('connection', async function(socket){
    model = await tf.loadLayersModel('file://model-game/model.json');
    socket.on('motion data', function(data){
        predictionDone = false;
        if(liveData.length < 300){
            liveData.push(data.xAcc, data.yAcc, data.zAcc, data.xGyro, data.yGyro, data.zGyro)
        }
    })

    socket.on('end motion data', function(){
        if(!predictionDone && liveData.length){
            predictionDone = true;
            predict(model, liveData, socket);
            liveData = [];
        }
    })

    socket.on('connected', function(data){
        console.log('front end connected')
    })
});

const predict = (model, newSampleData,socket) => {
    tf.tidy(() => {
        const inputData = newSampleData;
        const input = tf.tensor2d([inputData], [1, 300]);
        const predictOut = model.predict(input);
        const logits = Array.from(predictOut.dataSync());
        const winner = gestureClasses[predictOut.argMax(-1).dataSync()[0]];
        
        switch(winner){
            case 'punch':
                // socket.emit('gesture', 'alohomora');
                console.log('punch')
                break;
            case 'hadoken':
                // socket.emit('gesture', 'expelliarmus');
                console.log('hadoken')
                break;
            case 'uppercut':
                // socket.emit('gesture', 'expelliarmus');
                console.log('uppercut')
                break;
            default:
                break;
        }
    });
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});