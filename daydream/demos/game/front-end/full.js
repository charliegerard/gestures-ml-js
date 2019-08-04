let img = new Image();
img.src = 'images/ken.png';
img.onload = () => init();

let enemy = new Image();
enemy.src = 'images/guile.png';

let canvas = document.querySelector('canvas');
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight; //document.height is obsolete

let ctx = canvas.getContext('2d');

const scale = 4;
const width = 70;
const height = 80;
const enemyHeight = 90;
const scaledWidth = scale * width;
const scaledHeight = scale * height;

function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX * width, frameY * height, width, height,
        canvasX, canvasY, scaledWidth, scaledHeight);
}

let cycleLoop;
let currentLoopIndex = 0;
let enemyLoopIndex = 0;
let frameCount = 0;
let enemyFrameCount = 0;
let currentDirection = 1; //standing


let liveData = [];
let predictionDone = false;

let model;
const gestureClasses = ['hadoken', 'punch', 'uppercut'];

const socket = io.connect('http://localhost:3000', {transports:['websocket']});

var punchSound = new Howl({src: ['audio/huh1.wav']});
var hadokenSound = new Howl({src: ['audio/hadoken.mp3']});
var uppercut = new Howl({src: ['audio/shoryuken.mp3']});

socket.on('gesture', function(data){
    switch(data){
        case 'punch':
            punchSound.play();
            currentDirection = 2;
            hasMoved = true;
            cycleLoop = [0, 1, 2];
            playAnimation();
            break;
        case 'hadoken':
            hadokenSound.play();
            currentDirection = 0;
            hasMoved = true;
            cycleLoop = [0, 1, 2, 3];
            playAnimation();
            break;
        case 'uppercut':
            uppercut.play();
            break;
        default:
            break;
    }
});


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

const init = () => gameLoop();

const initEnemy = () => {
    let enemyCycleLoop = [0,1,2];
    window.requestAnimationFrame(initEnemy);

    let canvasX = -canvas.width + 400;
    let canvasY = canvas.height - (scaledHeight + 30);
    let frameY = 0;
    let frameX = enemyCycleLoop[enemyLoopIndex];

    ctx.save(); 
    ctx.translate(width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(enemy,
        frameX * width, frameY * enemyHeight, width, enemyHeight,
        canvasX, canvasY, scaledWidth, scaledHeight);

    ctx.restore(); 

    enemyFrameCount++;
    if (enemyFrameCount % 8 === 0) {
        enemyLoopIndex++;
        if (enemyLoopIndex >= enemyCycleLoop.length) {
            enemyLoopIndex = 0;
        }
        enemyFrameCount = 0;
    }
}

let hasMoved = false;

// window.addEventListener('keydown', e => {
//     // stopAnimation();
//     switch(e.key){
//         case 'p':
//             currentDirection = 2;
//             hasMoved = true;
//             cycleLoop = [0, 1, 2];
//             playAnimation();
//             break;
//         case 'ArrowLeft':
//             positionX -= MOVEMENT_SPEED;
//             currentDirection = 3;
//             hasMoved = true;
//             cycleLoop = [0, 1, 2, 3, 4];
//             playAnimation();
//             break;
//         case 'ArrowRight':
//             positionX += MOVEMENT_SPEED;
//             currentDirection = 3;
//             cycleLoop = [0, 1, 2, 3, 4];
//             playAnimation();
//             hasMoved = true;
//             break;
//         case 'h':
//             currentDirection = 0;
//             hasMoved = true;
//             cycleLoop = [0, 1, 2, 3];
//             playAnimation();
//             break;
//         default: 
//             break;
//     }
// });

function gameLoop(){
    cycleLoop = [0,1,2,3];
    playDefaultAnimation();
    initEnemy();
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

    if(currentDirection === 0){ //hadouken fireball
        let fireballCycleLoop = [0,1];

        drawFrame(fireballCycleLoop[currentLoopIndex],4,fireballPosition+=35, canvas.height - (scaledHeight + 30));

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