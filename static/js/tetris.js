import * as Pieces from './pieces.js';
import * as Config from './config.js';


const canvas = document.getElementById('tetrisCanvas');
const context = canvas.getContext('2d');

const BOARD_WIDTH = 10;
const VISIBLE_BOARD_HEIGHT = 20;
const BOARD_HEIGHT = 24;

const READY_SCREEN_TIMER = 1;
const BLANK = 0;


const FPS = 60;
let now;
let then;
let interval = 1000 / FPS;
let delta;
let count = 0;


init();

// Game initialization
function init() {
    // Initialize game state and start the game loop
    let board = new_board();
    let piece_bag = Object.keys(Pieces.PIECE_SHAPES);
    let curr_piece = null;
    let next_pieces = [];
    for (let i = 0; i < Config.NUM_NEXT_PIECES.length; i++) {
        next_pieces.push(get_new_piece(piece_bag));
    }
    let held_pieces = null;
    let piece_held_this_turn = false;
    let swap_hold_available = true;
    let game_over = false;

    // skip ready go pause

    let inital_move_side_done = false;
    now = Date.now();
    then = Date.now();
    requestAnimationFrame(update);
    // console.log(Pieces.I_PIECE);
}

let s = 0;
// Game loop
function update() {
    // while (true) {
    
    // Game logic goes here
    now = Date.now();
    
    delta = now - then;
    if (delta > interval) {
        count += 1;
        if (count == 60) {
            count = 0;
            console.log(s++);
        }
        then = now - (delta % interval);
    }
    requestAnimationFrame(update);
    // }
}

// Handle keyboard controls
document.addEventListener('keydown', event => {
    switch (event.keyCode) {
        case 37: // Left arrow
            // Move piece left
            break;
        case 39: // Right arrow
            // Move piece 
            break;
        // Add other controls
    }
});

function new_board() {
    let board = [];
    for (let yrow = 0; yrow < BOARD_HEIGHT; yrow++) {
        let row = [];
        for (let xcol = 0; xcol < BOARD_WIDTH; xcol++) {
            row.push(BLANK);
        }
        board.push(row);
    }
    return board;
}

function get_new_piece(piece_bag) {
    let r = Math.floor(Math.random() * piece_bag.length);
    let shape = piece_bag[r];
    delete piece_bag[r];
    let new_piece = { 'shape': shape, 'rotation': 0, 'x': 3, 'y': 3 }; // 'color': Pieces.PIECE_COLORS[shape]};
    return new_piece;
}