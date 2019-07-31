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
let fireballPosition = positionX + width;
let positionY = 0;
const FRAME_LIMIT = 8;

// const init = () => window.requestAnimationFrame(gameLoop);
const init = () => gameLoop();

let hasMoved = false;

window.addEventListener('keydown', e => {
    stopAnimation();
    switch(e.key){
        case 'p':
            currentDirection = 2;
            hasMoved = true;
            cycleLoop = [0, 1, 2];
            playAnimation();
            break;
        case 'ArrowLeft':
            positionX -= MOVEMENT_SPEED;
            currentDirection = 3;
            hasMoved = true;
            cycleLoop = [0, 1, 2, 3, 4];
            playAnimation();
            break;
        case 'ArrowRight':
            positionX += MOVEMENT_SPEED;
            currentDirection = 3;
            cycleLoop = [0, 1, 2, 3, 4];
            playAnimation();
            hasMoved = true;
            break;
        case 'h':
            currentDirection = 0;
            hasMoved = true;
            cycleLoop = [0, 1, 2, 3];
            playAnimation();
            break;
        case 'a':
            currentDirection = 4;
            // fireballPosition += 35;
            hasMoved = true;
            cycleLoop = [0, 1];
            playAnimation();

            triggerFireball();
            break;
        default: 
            currentDirection = 1;
            hasMoved = false;
            playDefaultAnimation();
            break;
    }
});

function gameLoop(){
    switch (currentDirection){
        case 0 || 1 || 5:
            cycleLoop = [0,1,2,3];
            break;
        case 2:
            cycleLoop = [0,1,2];
            break;
        case 3:
            cycleLoop = [0,1,2,3,4];
            break;
        case 4:
            cycleLoop = [0,1];
            break;
        default:
            break;
    }

    playDefaultAnimation();
}

let defaultAnim;
let anim;

const playDefaultAnimation = () => {
    let cycleLoop = [0,1,2,3];
    defaultAnim = window.requestAnimationFrame(playDefaultAnimation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(cycleLoop[currentLoopIndex],1,positionX, canvas.height - (scaledHeight + 30));

    if(!hasMoved){
        frameCount++;
        if (frameCount % 8 === 0) {
            currentLoopIndex++;

            if (currentDirection === 1) {
                if (currentLoopIndex >= cycleLoop.length) {
                    currentLoopIndex = 0;
                    stopAnimation();
                    playAnimation();
                }
            } else {
                if (currentLoopIndex >= cycleLoop.length) {
                    currentLoopIndex = 0;
                    stopAnimation();
                    // playAnimation();
                    playDefaultAnimation();
                }
            }
            // if (currentLoopIndex >= cycleLoop.length) {
            //     currentLoopIndex = 0;
            //     stopAnimation();
            //     playAnimation();
            // }
            frameCount = 0;
        }
    } else {
        stopAnimation();
        currentLoopIndex = 0;
        playAnimation();
        hasMoved = false;
    }
}

const stopAnimation = () => {
    window.cancelAnimationFrame(anim)
    window.cancelAnimationFrame(defaultAnim)
}

const playAnimation = () => {
    anim = window.requestAnimationFrame(playAnimation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawFrame(cycleLoop[currentLoopIndex],currentDirection,positionX, canvas.height - (scaledHeight + 30));

    if(currentDirection === 0){ //hadouken
        let fireballCycleLoop = [0,1];

        drawFrame(fireballCycleLoop[currentLoopIndex],4,fireballPosition+=15, canvas.height - (scaledHeight + 30));

        if(currentLoopIndex >= fireballCycleLoop.length){
            fireballPosition = positionX + width;
        }
    }

    frameCount++;
    if(frameCount % 8 === 0){
        currentLoopIndex++;

        if(currentLoopIndex >= cycleLoop.length){
            currentLoopIndex = 0;
            stopAnimation()
            playDefaultAnimation();
        }  
        frameCount = 0;
    }
}

const triggerFireball = () => {
    drawFrame(cycleLoop[currentLoopIndex],currentDirection,positionX, canvas.height - (scaledHeight + 30));
}

// if standing and key pressed, don't wait til end of cycleloop.