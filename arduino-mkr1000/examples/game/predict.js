const EtherPortClient = require("etherport-client").EtherPortClient;
const five = require('johnny-five');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/', express.static(__dirname + '/public'))

let liveData = [];
let predictionDone = false;
let started = false;
let model;
const gestureClasses = ['hadoken', 'punch', 'uppercut'];

let numParametersRecorded = 14; // 14 values from Arduino;
let numLinesPerFile = 190;
let numValuesExpected = numParametersRecorded * numLinesPerFile;

const init = async () => {
    model = await tf.loadLayersModel('file://model/model.json');
}

const board = new five.Board({
    port: new EtherPortClient({
      host: "192.168.1.113", //Your Arduino IP goes here
      port: 3030
    }),
    timeout: 1e5,
    repl: false
});

io.on('connection', function(socket){
  console.log('a user connected');

    board.on("ready", function() {
        console.log("Board ready!");
        const button = new five.Button("A0");

        const imu = new five.IMU({
            pins: [11,12], // connect SDA to 11 and SCL to 12
            controller: "MPU6050"
        });

        imu.on("data", function() {
            let dataAvailable = this.accelerometer.x;

            if(dataAvailable && !started){
                console.log('imu ready')
            }
            
            button.on("hold", () => {
                predictionDone = false;
                let data = {xAcc: this.accelerometer.x,
                    yAcc: this.accelerometer.y,
                    zAcc: this.accelerometer.z,
                    accPitch: this.accelerometer.pitch,
                    accRoll: this.accelerometer.roll,
                    acceleration: this.accelerometer.acceleration,
                    inclination: this.accelerometer.inclination,
                    orientation: this.accelerometer.orientation,
                    xGyro: this.gyro.x,
                    yGyro: this.gyro.y,
                    zGyro: this.gyro.z,
                };

                if (liveData.length < numValuesExpected){
                    liveData.push(data.xAcc, data.yAcc, data.zAcc, data.accPitch, data.accRoll, data.acceleration, data.inclination, data.orientation, data.xGyro, data.yGyro, data.zGyro)
                } 
            });

            button.on("release", function(){
                if(!predictionDone && liveData.length){
                    predictionDone = true;
                    predict(model, liveData, socket);
                    liveData = [];
                }
            });

            started = true
        });
    });

});

const predict = (model, newSampleData, socket) => {
    tf.tidy(() => {
        const inputData = newSampleData;

        const input = tf.tensor2d([inputData], [1, numValuesExpected]);
        const predictOut = model.predict(input);
        const logits = Array.from(predictOut.dataSync());
        const winner = gestureClasses[predictOut.argMax(-1).dataSync()[0]];
        
        switch(winner){
            case 'hadoken':
                socket.emit('gesture', winner)
                break;
            case 'punch':
                socket.emit('gesture', winner)
                break;
            case 'uppercut':
                socket.emit('gesture', winner)
                break;
            default:
                break;
        }
    });
}

init();

board.on("close", function() {
    console.log("Board disconnected");
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
