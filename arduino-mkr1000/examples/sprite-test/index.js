let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['hadoken', 'punch', 'uppercut'];

const socket = io.connect('http://localhost:3000', {transports:['websocket']});

socket.on('gesture', function(data){
    console.log(data)
});
