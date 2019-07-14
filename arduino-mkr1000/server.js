var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var led = new five.Led(13);

  // "blink" the led in 500ms on-off phase periods
  led.blink(500);

  // var acc = new five.Accelerometer({
  //   controller: "MPU6050",
  //   sensitivity: 16384 // optional
  // });

  // acc.on('change', function(){
  //   console.log("accelerometer");
  //   console.log("  x            : ", this.x);
  //   console.log("  y            : ", this.y);
  //   console.log("  z            : ", this.z);
  //   // console.log("  pitch        : ", this.pitch);
  //   // console.log("  roll         : ", this.roll);
  //   // console.log("  acceleration : ", this.acceleration);
  //   // console.log("  inclination  : ", this.inclination);
  //   // console.log("  orientation  : ", this.orientation);
  //   console.log("--------------------------------------");
  // });

  // var gyro = new five.Gyro({
  //   controller: "MPU6050"
  // });

  // gyro.on("change", function() {
  //   console.log("gyro");
  //   console.log("  x            : ", this.x);
  //   console.log("  y            : ", this.y);
  //   console.log("  z            : ", this.z);
  //   // console.log("  pitch        : ", this.pitch);
  //   // console.log("  roll         : ", this.roll);
  //   // console.log("  yaw          : ", this.yaw);
  //   // console.log("  rate         : ", this.rate);
  //   // console.log("  isCalibrated : ", this.isCalibrated);
  //   console.log("--------------------------------------");
  // });
});


