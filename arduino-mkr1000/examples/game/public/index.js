import Game from './game.js';

const game = new Game()
game.start()

const socket = io.connect('http://localhost:3000', {transports:['websocket']});

var punchSound = new Howl({src: ['audio/huh1.wav']});
var hadokenSound = new Howl({src: ['audio/hadoken.mp3']});
var uppercut = new Howl({src: ['audio/shoryuken.mp3']});
socket.on('gesture', function(data){
    switch(data){
        case 'punch':
            punchSound.play();
            game.setLoopAndPosition([0, 1, 2], 2);
            break;
        case 'hadoken':
            hadokenSound.play();
            game.setLoopAndPosition([0, 1, 2, 3], 0);
            break;
        case 'uppercut':
            uppercut.play();
            game.setLoopAndPosition([0, 1, 2, 3, 4, 5, 6], 4);
            break;
        default:
            break;
    }
});

// test - to remove
// window.addEventListener('keydown', e => {
//     switch(e.key){
//         case 'p':
//             punchSound.play();
//             game.setLoopAndPosition([0, 1, 2], 2);
//             break;
//         case 'h':
//             hadokenSound.play();
//             game.setLoopAndPosition([0, 1, 2, 3], 0);
//             break;
//         case 'a':
//             uppercut.play();
//             game.setLoopAndPosition([0, 1, 2, 3, 4, 5, 6], 4);
//             break;
//         default: 
//             break;
//     }
// });
