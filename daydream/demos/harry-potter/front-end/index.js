let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['alohomora', 'expelliarmus'];

const socket = io.connect('http://localhost:3000', { transports: ['websocket'] });

const expelliarmusVideo = document.getElementsByClassName('expelliarmus')[0];

window.onload = () => {
    expelliarmusVideo.src = "assets/expelliarmus.mp4";
    expelliarmusVideo.load();
}

socket.on('gesture', function (data) {
    switch (data) {
        case 'alohomora':
            break;
        case 'expelliarmus':
            playVideo();
            break;
        default:
            break;
    }
});

const playVideo = () => {
    expelliarmusVideo.style.display = 'block';

    var playPromise = expelliarmusVideo.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            expelliarmusVideo.play();
        })
        .catch(error => {
            expelliarmusVideo.play();
        });
    }
}