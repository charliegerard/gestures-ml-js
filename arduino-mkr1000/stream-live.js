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

    var acc = new five.Accelerometer({
        controller: "MPU6050",
        sensitivity: 16384 // optional
    });

    var gyro = new five.Gyro({
        controller: "MPU6050"
    });   

    acc.on('change', function(){
        data.concat(`${this.x} ${this.y} ${this.z}`);
    });

    gyro.on("change", function() {
        data.concat(`${this.x} ${this.y} ${this.z}`);
    });

    console.log("ALL DATA: ", data);
});

board.on("close", function() {
    console.log("Board disconnected");
});