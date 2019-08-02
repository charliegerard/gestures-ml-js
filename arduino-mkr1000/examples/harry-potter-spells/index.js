let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['alohomora', 'expelliarmus'];

const socket = io.connect('http://localhost:3000', { transports: ['websocket'] });

socket.on('gesture', function (data) {
    switch (data) {
        case 'alohomora':
            console.log('alohomora')
            break;
        case 'expelliarmus':
            console.log('expelliarmus')
            break;
        default:
            break;
    }
});
