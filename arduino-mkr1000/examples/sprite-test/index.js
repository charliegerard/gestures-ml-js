let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['hadoken', 'punch', 'uppercut'];

const socket = io.connect('http://localhost:3000', {transports:['websocket']});

var punchSound = new Howl({src: ['audio/huh1.wav']});
var hadokenSound = new Howl({src: ['audio/hadoken.mp3']});
var jumpSound = new Howl({src: ['audio/shoryuken.mp3']});

socket.on('gesture', function(data){
    console.log(data)
    if(data === 'punch'){
        punchSound.play();
    }
    switch(data){
        case 'punch':
            punchSound.play();
            break;
        case 'hadoken':
            hadokenSound.play();
            break;
        case 'jump':
            jumpSound.play();
            break;
        default:
            break;
    }
});
