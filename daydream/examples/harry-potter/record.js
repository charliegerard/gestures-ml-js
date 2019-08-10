const fs = require('fs');
var daydream = require('daydream-node')();

let stream;
let started = false;

let gestureType;
let sampleNumber;
let previousSampleNumber;

process.argv.forEach(function (val, index, array) {
    gestureType = array[2];
    sampleNumber = parseInt(array[3]);
    previousSampleNumber = sampleNumber;
    stream = fs.createWriteStream(`./data/newHP/sample_${gestureType}_${sampleNumber}.txt`, {flags:'a'});
    
    daydream.onStateChange(function(data){
        if(data.isClickDown){
            if(sampleNumber !== previousSampleNumber){
                stream = fs.createWriteStream(`./data/newHP/sample_${gestureType}_${sampleNumber}.txt`, {flags:'a'});
            }
            stream.write(`${data.xAcc} ${data.yAcc} ${data.zAcc} ${data.xGyro} ${data.yGyro} ${data.zGyro}\r\n`);

            started = true;
        } else {
            if(started){                
                stream.end()
                started = false;
                sampleNumber+=1;
            }
        }
    });
});