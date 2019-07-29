let img = new Image();
img.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';
img.onload = function () {
    init();
};

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

const scale = 2;
const width = 16;
const height = 18;
const scaledWidth = scale * width;
const scaledHeight = scale * height;

function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX * width, frameY * height, width, height,
        canvasX, canvasY, scaledWidth, scaledHeight);
}

function init() {
    window.requestAnimationFrame(step);
}

const cycleLoop = [0, 1, 0, 2];
let currentLoopIndex = 0;
let frameCount = 0;
let currentDirection = 0;

function step() {
    frameCount++;
    if (frameCount < 15) {
        window.requestAnimationFrame(step);
        return;
    }
    frameCount = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(cycleLoop[currentLoopIndex], currentDirection, 0, 0);
    currentLoopIndex++;
    if (currentLoopIndex >= cycleLoop.length) {
        currentLoopIndex = 0;
        currentDirection++;
    }
    if(currentDirection >= 4){
        currentDirection = 0;
    }
    window.requestAnimationFrame(step);
}