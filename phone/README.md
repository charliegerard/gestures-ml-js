# Gesture recognition using a modern phone and Tensorflow.js

To use this project, you need to have Chrome on a modern phone.

Using the phone's built-in accelerometer and gyroscope, as well as the Generic Sensor API, we can record data, train a machine learning algorithm and run predictions using Tensorflow.js and web sockets.

Feel free to try the [live demo](https://bit.ly/sf-ml)

## Current status

**WIP**

Recording, training and predicting is working and the accuracy is pretty good but I suspect I made a mistake in the training file that I need to look at.

## Prerequisites

* Modern phone
* Chrome on mobile


## How to use

### 1. Record data

To start recording data, run the following command:

```js
node record.js
```

In another terminal window, run `ngrok` on port 3000.

Open Chrome on your phone and visit the url given by ngrok, followed by `/record`.

When you hold down any finger on the screen, it will send data to the Node.js server via web sockets. 
When you release, all this data is saved in a `.txt` file in the `data` folder.

To record gesture of the same type, no need to re-run the above command all the time, simply hold down any fingers on the screen again and execute the same gesture. When released, the new data will be saved in a new file in the `data` folder.


## Train the Machine Learning algorithm

Once you've recorded data for multiple gestures, you can train a machine learning algorithm to find patterns in this data so it will be able to classify new samples of data it has never seen before.

```
note: this process is going to allow an algorithm to look at all the data from all samples of all gestures, and try to figure out what makes a "punch", a "hadoken" and a "uppercut". Once it has figured out some patterns and the accuracy of our model is good (more than 0.7), we can use the model created to give it new live data it has not been trained with and try to classify it between the different gestures it "knows".
```

```js
node train.js
```

This command will read the data in all the files, do some data processing, split between test and training set, create and save the model that should be available in the `model` folder.


## Use the model for predictions

Once the model is generated, you can predict new data samples by running:

```js
node predict.js
```

In another terminal window, run ngrok on port 4000.

Using Chrome on your phone, visit the url indicated by ngrok followed by `/predict`.

When this command is run, you can execute one of the gestures you trained by holding down any finger on the screen, executing the gesture you want to predict, and release the screen to let the model classify the new samples.

---

## Next steps:

* Add error handling
* Use a LSTM algorithm for continuous prediction
* Refactor code