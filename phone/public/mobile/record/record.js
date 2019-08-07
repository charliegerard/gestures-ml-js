const socket = io.connect('http://localhost:3000', { transports: ['websocket'] });

let interval;
let phoneData = [];

window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
    var absolute = event.absolute;
    var alpha    = event.alpha;
    var beta     = event.beta;
    var gamma    = event.gamma;
  
    // Do stuff with the new orientation data
}


document.getElementsByTagName('button')[0].addEventListener('mousedown', (e) => {
    interval = setInterval(function() {
        phoneData.push(1);
        // You are now in a `hold` state, you can do whatever you like!
        console.log('boo')
    }, 10);
})

document.getElementsByTagName('button')[0].addEventListener('mouseup', (e) => {
    socket.emit('mouse', phoneData)
    clearInterval(interval);
});
