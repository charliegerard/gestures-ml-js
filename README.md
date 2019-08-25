# Gesture recognition using hardware and Tensorflow.js

Experiments building a gesture recognition system using an Arduino, a Daydream controller and a mobile phone.

## Demo:

![Demo](demo.gif)

Each project has 2 demos: one to play a prototype game of street fighter, and one to predict magic wand movements.


## How it works:

Using an accelerometer/gyroscope (MPU6050 for the Arduino, and built-in sensors for the Daydream and phone), we can record data streamed while performing a gesture. By repeating and recording gestures multiple times, we can feed all this data to a machine learning algorithm to find patterns in the data. Once a model is created, we can use it to predict new live data and classify it to use as input for an interface or device.

## Arduino project:

See `arduino-mkr1000` folder.

## Daydream project:

See `daydream` folder.

# Phone project:

See `phone` folder.


## Article



---


## To do:

- [ ] Host phone demos on Codesandbox

  