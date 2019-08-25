# Gesture recognition using the Daydream controller and Tensorflow.js

To use this project, you need a Daydream controller.

Using the device's built-in accelerometer and gyroscope, we can record data while performing a gesture. After recording enough data, we can train an algorithm to build a gesture recognition model and predict new gestures.

## Current status:

**WIP**

Recording, training and predicting is working and the accuracy is pretty good but I suspect I made a mistake in the training file that I need to look at.

## Prerequisites

* Daydream controller
* Node v10


## How to use

### 1. Record data

The command takes 2 arguments: a *gesture type* and a *sample number*.

```js
node record.js <gesture type> <sample number>

//e.g node record.js punch 0
```

Providing these 2 arguments will help save the data in separate files, e.g *sample_punch_0.txt*.

After this command is run, the data will be recorded **when you hold down the trackpad** of the controller.

When you release the button, all this data is saved in a `.txt` file in the `data` folder.

To record gesture of the same type, no need to re-run the above command all the time, simply press again the trackpad and execute the same gesture. When the button is released, the new data will be saved in a new file in the `data` folder.


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

When this command is run, you can execute one of the gestures you trained by holding down the button, executing the gesture you want to predict, and release the button to let the model classify the new samples.

---

## Next steps:

* Add error handling
* Use a LSTM algorithm for continuous prediction
* Refactor code
