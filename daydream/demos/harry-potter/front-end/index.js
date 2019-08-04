let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['alohomora', 'expelliarmus'];

const socket = io.connect('http://localhost:3000', { transports: ['websocket'] });
const expelliarmusVideo = document.getElementsByClassName('expelliarmus')[0];
const patronumVideo = document.getElementsByClassName('patronum')[0];

window.onload = () => {
    // expelliarmusVideo.src = "assets/expelliarmus.mp4";
    expelliarmusVideo.load();
    patronumVideo.load();
}

socket.on('gesture', function (data) {
    switch (data) {
        case 'alohomora':
            playVideo(patronumVideo);
            break;
        case 'expelliarmus':
            playVideo(expelliarmusVideo);
            break;
        default:
            break;
    }
});

const playVideo = (video) => {
    video.style.display = 'block';
    // video.play();

    var playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Automatic playback started!
          // Show playing UI.
          // We can now safely pause video...
        //   video.pause();
            // video.pause();
            video.play();
        })
        .catch(error => {
            console.log(error)
            // video.pause();
            video.play();
          // Auto-play was prevented
          // Show paused UI.
        });
    }
}