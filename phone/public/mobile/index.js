// const socket = io.connect('http://localhost:3000', { transports: ['websocket'] });
const socket = io();
let interval;
let phoneData = [];

let rotation = {
    x: '',
    y: '',
    z: ''
}

let acceleration = {
    x: '',
    y: '',
    z: ''
}

window.onload = function() {
    socket.emit('connected')

    function handleOrientation(e) {
        rotation.x = e.beta;
        rotation.y = e.gamma;
        rotation.z = e.alpha;
    }

    function handleMotion(e){
        acceleration.x = e.accelerationIncludingGravity.x;
        acceleration.y = e.accelerationIncludingGravity.y;
        acceleration.z = e.accelerationIncludingGravity.z;
    }
    
    window.addEventListener("deviceorientation", handleOrientation, true);
    window.addEventListener("devicemotion", handleMotion, true);

    document.body.addEventListener('touchstart', (e) => {
        let data = {
            xAcc: acceleration.x,
            yAcc: acceleration.y,
            zAcc: acceleration.z,
            xGyro: rotation.x,
            yGyro: rotation.y,
            zGyro: rotation.z,
        }
        interval = setInterval(function() {
            socket.emit('motion data', data)
        }, 10);
    })
}

document.body.addEventListener('touchend', (e) => {
    socket.emit('end motion data')
    clearInterval(interval);
});
