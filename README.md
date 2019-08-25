# Gesture recognition using hardware and Tensorflow.js

**This project is very experimental and in active development.**

Experiments building a gesture recognition system using an Arduino, a Daydream controller and a mobile phone, with Tensorflow.js

## Demo:

![Demo](demo.gif)

Each project has 2 demos: one to play a game of street fighter, and one to predict magic wand movements.

## How it works:

Using an accelerometer/gyroscope (MPU6050 for the Arduino, and built-in sensors for the Daydream and phone), we can record data streamed while performing a gesture. By repeating and recording gestures multiple times, we can feed all this data to a machine learning algorithm to find patterns in the data. Once a model is created, we can use it to predict new live data and classify it to use as input for an interface or device.

## Arduino project:

See [arduino-mkr1000](arduino-mkr1000/) folder.

## Daydream project:

See [daydream](daydream/) folder.

## Phone project:

See [phone](phone/) folder.

---


## Blog post

More details on dev.to in [this tutorial](https://dev.to/devdevcharlie/play-street-fighter-with-body-movements-using-arduino-and-tensorflow-js-41m-temp-slug-4644698?preview=37562860f2bbb1ca400e51641a8b4097f88e85e9cad9aca24a25c5fff4f00c3d1dc01ab2c14ed0e9e8244ffe2eb48f46146a398dd5fce375e67fde01).



---


## To do:

- [ ] Host phone demos on Codesandbox

  