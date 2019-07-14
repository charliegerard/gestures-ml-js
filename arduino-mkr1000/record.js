const EtherPortClient = require("etherport-client").EtherPortClient;
const five = require('johnny-five');
const fs = require('fs');

let gestureType;
let stream, sampleNumber, previousSampleNumber;

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
    let data = "";
    const button = new five.Button("A0");

    const led = new five.Pin(13);

    process.argv.forEach(function(val, index, array){
        gestureType = array[2];
        sampleNumber = parseInt(array[3]);
        previousSampleNumber = sampleNumber;
    });

    stream = fs.createWriteStream(`./data/sample_${gestureType}_${sampleNumber}.txt`, {flags: 'a'});

    button.on("press", function() {
        console.log( "Button pressed" );
        started = true;
    });

    button.on("hold", function() {
        console.log( "Button held" );
        stream.write(`START hello END \r\n`);
    });

    button.on("release", function() {
        console.log( "Button released" );
        if(started){
            stream.end();
            started = false;
            sampleNumber += 1;
        }
    });

    led.read(function(error, value) {
        console.log(value);
    });
    
        // var acc = new five.Accelerometer({
        //     controller: "MPU6050",
        //     sensitivity: 16384 // optional
        // });
    
        // var gyro = new five.Gyro({
        //     controller: "MPU6050"
        // });   
    
        // acc.on('change', function(){
        //     data.concat(`${this.x} ${this.y} ${this.z}`);
        // });
    
        // gyro.on("change", function() {
        //     data.concat(`${this.x} ${this.y} ${this.z}`);
        // });

        // if(sampleNumber !== previousSampleNumber){
        //     stream.write(`START ${data} END \r\n`);
        // }
    
        // console.log("ALL DATA: ", data);
});

board.on("close", function() {
    console.log("Board disconnected");
});