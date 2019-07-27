const EtherPortClient = require("etherport-client").EtherPortClient;
const five = require('johnny-five');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

let liveData = [];
let predictionDone = false;
let started = false;
let model;
const gestureClasses = ['alohomora', 'expelliarmus'];

const init = async () => {
    model = await tf.loadLayersModel('file://model-hp/model.json');
}

const board = new five.Board({
    port: new EtherPortClient({
      host: "192.168.1.113", //Your Arduino IP goes here
      port: 3030
    }),
    timeout: 1e5,
    repl: false
});

board.on("ready", function() {
    console.log("Board ready!");
    const button = new five.Button("A0");

    const imu = new five.IMU({
        pins: [11,12], // connect SDA to 11 and SCL to 12
        controller: "MPU6050"
    });

    imu.on("data", function() {
        let data = {xAcc: this.accelerometer.x,
            yAcc: this.accelerometer.y,
            zAcc: this.accelerometer.z,
            xGyro: this.gyro.x,
            yGyro: this.gyro.y,
            zGyro: this.gyro.z
        };

        if(data && !started){
            console.log('imu ready')
        }
        
        button.on("hold", function() {
            predictionDone = false;
            if(liveData.length < 882){
                liveData.push(data.xAcc, data.yAcc, data.zAcc, data.xGyro, data.yGyro, data.zGyro)
            } 
        });

        button.on("release", function(){
            if(!predictionDone && liveData.length){
                predictionDone = true;
                predict(model, liveData);
                liveData = [];
            }
        });

        started = true
    });
});

const predict = (model, newSampleData) => {
    tf.tidy(() => {
        const inputData = newSampleData;
        const input = tf.tensor2d([inputData], [1, 882]);
        const predictOut = model.predict(input);
        const logits = Array.from(predictOut.dataSync());
        const winner = gestureClasses[predictOut.argMax(-1).dataSync()[0]];
        
        switch(winner){
            case 'alohomora':
                console.log('alohomora')
                break;
            case 'expelliarmus':
                console.log('expelliarmus')
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