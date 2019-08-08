# Gesture recognition using the Daydream controller

To use this project, you need a Daydream controller.

Using the device's built-in accelerometer and gyroscope, we can record data while performing a gesture. After recording enough data, we can train an algorithm to build a gesture recognition model and predict new gestures.

## Process

### 1. Record data

To record your own data to train the machine learning algorithm, run the following command:

```js
node record.js <gesture type> <sample number>

// node record.js punch 0
```

After this command is ran, the data will be recorded **when you click on the trackpad** of the controller and **keep it pressed while executing the gesture**.

When you release the button, all this data is saved in a `.txt` file in the `data` folder.

To record gesture of the same type, no need to re-run the above command all the type, simply press again the trackpad and execute the same gesture. When the button is released, the new data will be saved in a new file in the `data` folder.

## Train the ML algorithm

Once you have recorded some data, you can run the following command:

```js
node train.js
```

This will read the data in all the files, do some data processing, split between test and training set, create and save the model that should be available in the `model` folder.

## Use the model for predictions

Once the model is generated, you can predict new data samples by running:

```js
node predict.js
```

When this command is ran, you can execute one of the gestures you trained by pressing the button, and executing the gesture you want to predict.



