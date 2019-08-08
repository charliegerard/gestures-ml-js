let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['hadoken', 'punch', 'uppercut'];

const socket = io.connect('http://localhost:3000', {transports:['websocket']});

var punchSound = new Howl({src: ['audio/huh1.wav']});
var hadokenSound = new Howl({src: ['audio/hadoken.mp3']});
var uppercut = new Howl({src: ['audio/shoryuken.mp3']});

socket.on('gesture', function(data){
    console.log(data)
    switch(data){
        case 'punch':
            punchSound.play();
            break;
        case 'hadoken':
            hadokenSound.play();
            break;
        case 'uppercut':
            uppercut.play();
            break;
        default:
            break;
    }
});
