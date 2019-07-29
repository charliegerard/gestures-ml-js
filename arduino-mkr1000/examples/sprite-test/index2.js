let img = new Image();
img.src = 'images/ken.png';
img.onload = () => init();

let canvas = document.querySelector('canvas');
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight; //document.height is obsolete

let ctx = canvas.getContext('2d');

const scale = 2;
const width = 70;
const height = 80;
const scaledWidth = scale * width;
const scaledHeight = scale * height;

function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX * width, frameY * height, width, height,
        canvasX, canvasY, scaledWidth, scaledHeight);
}

const init = () => window.requestAnimationFrame(gameLoop);

let cycleLoop;
let currentLoopIndex = 0;
let frameCount = 0;
let currentDirection = 1; //standing

// currentDirection:
// 0 ==> hadouken
// 1 ==> standing
// 2 ==> punch
// 3 ==> walk

const MOVEMENT_SPEED = 6;
let positionX = 0;
let fireballPosition = positionX;
let positionY = 0;
const FRAME_LIMIT = 8;
let keyPresses = {};

window.addEventListener('keydown', e => keyPresses[e.key] = true);
window.addEventListener('keyup', e => keyPresses[e.key] = false);

function gameLoop(){
    frameCount++;
    if (frameCount < FRAME_LIMIT) {
        window.requestAnimationFrame(gameLoop);
        return;
    }
    frameCount = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let hasMoved = false;

    if (keyPresses.ArrowLeft) {
        positionX -= MOVEMENT_SPEED;
        currentDirection = 3;
        hasMoved = true;
    } else if (keyPresses.ArrowRight) {
        positionX += MOVEMENT_SPEED;
        currentDirection = 3;
        hasMoved = true;
    } else if (keyPresses.p) {
        currentDirection = 2;
        hasMoved = true;
    } else if (keyPresses.h) {
        currentDirection = 0;
        hasMoved = true;
    } else if (keyPresses.a) {
        currentDirection = 4;
        fireballPosition += 35;
        hasMoved = true;
    }

    if(currentDirection === 0 || currentDirection === 1){
        positionX = positionX;
        cycleLoop = [0,1,2,3];
    } else if(currentDirection === 2){
        positionX = positionX;
        cycleLoop = [0, 1, 2];
    } else if(currentDirection === 3){
        cycleLoop = [0,1,2,3,4];
    } else if(currentDirection === 4){
        cycleLoop = [0,1];
    } else if(currentDirection === 5){
        cycleLoop = [0,1,2,3];
    }

    // drawFrame(cycleLoop[currentLoopIndex],currentDirection,positionX, canvas.height - (scaledHeight + 30));

        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
            if(currentDirection === 4){
                currentDirection = 5;
            }
           currentLoopIndex = 0;
        //    drawFrame(cycleLoop[currentLoopIndex],1,positionX, canvas.height - (scaledHeight + 30));
        //    currentDirection = 1;
        }

    if(currentDirection === 4){
        drawFrame(cycleLoop[currentLoopIndex],currentDirection,fireballPosition, canvas.height - (scaledHeight + 30));
    } else {
        drawFrame(cycleLoop[currentLoopIndex],currentDirection,positionX, canvas.height - (scaledHeight + 30));
    }

    // currentLoopIndex++;
    // if (currentLoopIndex >= cycleLoop.length) {
    //     if(currentDirection === 4){
    //         currentDirection = 5;
    //     }
    //    currentLoopIndex = 0;
    // //    drawFrame(cycleLoop[currentLoopIndex],1,positionX, canvas.height - (scaledHeight + 30));
    // //    currentDirection = 1;
    // }

    window.requestAnimationFrame(gameLoop)
}