var EtherPortClient = require("etherport-client").EtherPortClient;
var five = require('johnny-five');

var board = new five.Board({
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

    var imu = new five.IMU({
        pins: [11,12], // connect SDA to 11 and SCL to 12
        controller: "MPU6050"
    });

    imu.on("change", function() {
        data = `START ${this.accelerometer.x} 
            ${this.accelerometer.y} 
            ${this.accelerometer.z} 
            ${this.gyro.x}
            ${this.gyro.y} 
            ${this.gyro.z} END`;
            
        console.log("ALL DATA: ", data);
    });
});

board.on("close", function() {
    console.log("Board disconnected");
});