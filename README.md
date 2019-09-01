# Gesture recognition using hardware and Tensorflow.js

**This project is very experimental and in active development.**

Experiments building a gesture recognition system using an Arduino, a Daydream controller and a mobile phone, with Tensorflow.js

*Inspired by a [similar project](https://blog.mgechev.com/2018/10/20/transfer-learning-tensorflow-js-data-augmentation-mobile-net/) by [Minko Gechev](https://twitter.com/mgechev) using the webcam*.

## Demo:

![Demo](demo.gif)

Each project has 2 demos: one to play a game of street fighter, and one to predict magic wand movements.

Sprites used in the Street Fighter demo come from this [Codepen](https://codepen.io/jkneb/pen/smtHA) and [this repo](https://github.com/jkneb/street-fighter-css)

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

More details on in [this blog post](https://dev.to/devdevcharlie/play-street-fighter-with-body-movements-using-arduino-and-tensorflow-js-4kbi).



---
