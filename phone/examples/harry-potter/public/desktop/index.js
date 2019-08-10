let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['alohomora', 'expelliarmus'];

const socket = io.connect('http://localhost:3000', { transports: ['websocket'] });
const expelliarmusVideo = document.getElementsByClassName('expelliarmus')[0];
const patronumVideo = document.getElementsByClassName('patronum')[0];
const lumosVideo = document.getElementsByClassName('lumos')[0];

window.onload = () => {
    expelliarmusVideo.load();
    patronumVideo.load();
    lumosVideo.load()

    document.getElementsByTagName('button')[0].onclick = () => {
        document.getElementsByClassName('intro')[0].classList.add('fade');
        
    }
}

socket.on('gesture', function (data) {
    switch (data) {
        case 'lumos':
            playVideo(lumosVideo);
            break;
        case 'expelliarmus':
            playVideo(expelliarmusVideo);
            break;
        default:
            break;
    }
});

const playVideo = (video) => {
    if(video === expelliarmusVideo){
        expelliarmusVideo.style.display = 'block';
        lumosVideo.style.display = 'none';
    } else {
        expelliarmusVideo.style.display = 'none';
        lumosVideo.style.display = 'block';
    }

    var playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            if(video === expelliarmusVideo){
                expelliarmusVideo.play();
                lumosVideo.pause();
            } else {
                expelliarmusVideo.pause();
                lumosVideo.play();
            }

            // video.play();
        })
        .catch(error => {
            console.log("error: ", error);
        });
    }
}