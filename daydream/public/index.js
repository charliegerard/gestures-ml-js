let liveData = [];
let predictionDone = false;
let model;
const gestureClasses = ['cross', 'square', 'triangle'];

const init = async() => {
    model = await tf.loadLayersModel('http://localhost:5000/model-1/model.json');

    const startButton = document.getElementById('start');
    startButton.onclick = () => {
        var controller = new DaydreamController();
        controller.onStateChange( function ( state ) {
            if( state.isClickDown ){
                if(liveData.length < 360){
                    liveData.push(state.xAcc, state.yAcc, state.zAcc, state.xGyro, state.yGyro, state.zGyro)
                }
            } else {
                if(!predictionDone && liveData.length){
                    predictionDone = true;
                    predict(model, liveData);
                    liveData = [];
                }
            }
        } );
        controller.connect();
    }
}



const predict = (model, newSampleData) => {
    tf.tidy(() => {
        const inputData = newSampleData;
        const input = tf.tensor2d([inputData], [1, 360]);
        const predictOut = model.predict(input);
        const logits = Array.from(predictOut.dataSync());
        const winner = gestureClasses[predictOut.argMax(-1).dataSync()[0]];
    
        console.log("GESTURE: ", winner);
    });
}

init();