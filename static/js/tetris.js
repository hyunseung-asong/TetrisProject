import * as Pieces from './pieces.js';
import * as Config from './config.js';

const maindiv = document.getElementById("main");
const bgCanvas = document.getElementById("bgCanvas");
const bgctx = bgCanvas.getContext("2d");
const gameCanvas = document.getElementById("gameCanvas");
const gamectx = gameCanvas.getContext("2d");
const holdCanvas = document.getElementById("holdCanvas");
const holdctx = holdCanvas.getContext("2d");
const queueCanvas = document.getElementById("queueCanvas");
const queuectx = queueCanvas.getContext("2d");
// draw_box(0, 0, Config.PIECE_COLORS['I']);
// draw_box(1, 0, Config.PIECE_COLORS['I']);
// draw_box(0, 1, Config.PIECE_COLORS['I']);
// draw_box(1, 1, Config.PIECE_COLORS['I']);
// draw_box(2, 2, Config.PIECE_COLORS['I']);
window.addEventListener('load', () => {

    maindiv.focus();
    addKeyEventListeners();
    maindiv.addEventListener("click", () => {
        console.log("clicked");
        maindiv.focus();
    });
});

const interval = 1000 / Config.FPS;;
let now;
let then;
let delta;

let board;
let piece_bag;
let next_pieces;
let curr_piece;
let held_piece;

let game_over;
let paused;
let ready_go_screen;
let draw_ready;
let draw_go;
let ready_screen_time;

let inital_move_side_done;
let last_move_down_time;
let last_move_side_time;
let last_move_side_pressed;
let last_fall_time;
let moving_left;
let moving_right;
let moving_down;
let piece_placed;
let swap_hold_avail;
let piece_held_this_turn;

init();

// Game initialization
function init() {
    // board state variables
    draw_bg();

    board = new_board();
    piece_bag = Object.keys(Pieces.PIECE_SHAPES);
    curr_piece = null;
    next_pieces = [];
    for (let i = 0; i < Config.NUM_NEXT_PIECES; i++) {
        next_pieces.push(get_new_piece(piece_bag));
    }
    held_piece = null;

    piece_held_this_turn = false;
    swap_hold_avail = true;
    game_over = false;
    paused = false;

    inital_move_side_done = false;
    last_move_down_time = Date.now();
    last_move_side_time = Date.now();
    last_move_side_pressed = Date.now();
    last_fall_time = Date.now();
    moving_left = false;
    moving_right = false;
    moving_down = false;
    piece_placed = false;

    ready_go_screen = true;
    draw_ready = false;
    draw_go = false;
    ready_screen_time = Date.now();



    // timer variables
    now = Date.now();
    then = Date.now();
    delta = 0;
    requestAnimationFrame(update);
}


// Game loop
function update() {
    // Game logic goes here
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        then = now - (delta % interval);
        // Runs this FPS times per 1 sec
        // check_for_quit();
        if (!game_over) {
            if (!ready_go_screen) {
                if (curr_piece == null) {
                    curr_piece = next_pieces.pop();
                    if (!is_valid_position(board, curr_piece)) {
                        move_piece(board, curr_piece, 0, -1);
                    }
                    if (piece_bag.length == 0) {
                        piece_bag = Object.keys(Pieces.PIECE_SHAPES);
                    }
                    next_pieces.push(get_new_piece(piece_bag));
                }

                // handle key events

                if (!paused) {
                    // continue moving side if key is held
                    if (inital_move_side_done && now - last_move_side_pressed > Config.MOVE_SIDEWAYS_OFFSET) {
                        if ((moving_left || moving_right) && now - last_move_side_time > Config.MOVE_SIDEWAYS_FREQ) {
                            if (moving_left) {
                                move_piece(board, curr_piece, -1, 0);
                            } else if (moving_right) {
                                move_piece(board, curr_piece, 1, 0);
                            }
                            last_move_side_time = now;
                        }
                    }
                    // continue moving down if key is held (softdrop)
                    if (moving_down && now - last_move_down_time > Config.MOVE_DOWN_FREQ) {
                        move_piece(board, curr_piece, 0, 1);
                        last_move_down_time = now;
                        last_fall_time = now;
                    }
                    // let piece fall naturally
                    if (now - last_fall_time > Config.FALL_FREQ) {
                        //solidify piece
                        if (is_valid_position(board, curr_piece, 0, 1)) {
                            curr_piece['y'] += 1;
                            last_fall_time = now;
                        } else {
                            piece_placed = true;
                            moving_down = false;
                            moving_left = false;
                            moving_right = false;
                        }
                    }
                }

            } else {
                // ready go screen is true
                if (Config.READY_SCREEN_TIMER > now - ready_screen_time) {
                    draw_ready = true;
                } else if (Config.READY_SCREEN_TIMER * 2 > now - ready_screen_time) {
                    draw_go = true;
                    draw_ready = false;
                } else {
                    draw_ready = false;
                    draw_go = false;
                    ready_go_screen = false;
                }
            }

            remove_complete_lines(board);
            erase_board();
            draw_board(board);
            if (curr_piece != null) {
                draw_piece_shadow(board, curr_piece);
                draw_piece(curr_piece);
            } else {
                print_board(board);
            }
            if (next_pieces != null) {
                draw_next_pieces(next_pieces);
            }
            if (held_piece != null) {
                draw_held_piece(held_piece);
            }
            if (piece_placed) {
                if (!is_valid_position(board, curr_piece, 0, 0)) {
                    game_over = true;
                    // console.log("gg");
                } else {
                    add_to_board(board, curr_piece);
                    curr_piece = null;
                    piece_placed = false;
                    swap_hold_avail = true;
                    last_fall_time = now;
                    last_move_side_time = now;
                    last_move_side_pressed = now;
                    last_move_down_time = now;
                }
            }
            if (piece_held_this_turn) {
                curr_piece = null;
                piece_held_this_turn = false;
            }
            if (draw_ready) {
                //draw_text("READY", TEXT_FONT, FONT_SIZE, FONT_COLOR, FONT_BACKGROUND_COLOR);
            }
            if (draw_go) {
                //draw_text
            }
            if (paused) {
                //draw_text
            }
        }
    }
    if (!game_over) {
        requestAnimationFrame(update);
    }
}

function addKeyEventListeners() {
    // key released

    maindiv.addEventListener("keyup", (e) => {
        if (!e.repeat) {
            switch (e.key) {
                case Config.KEYBINDS['move_left']:
                    moving_left = false;
                    inital_move_side_done = false;
                    break;
                case Config.KEYBINDS['move_right']:
                    moving_right = false;
                    inital_move_side_done = false;
                    break;
                case Config.KEYBINDS['softdrop']:
                    moving_down = false;
                    break;
                default:
                    break;
            }
        }
    });
    maindiv.addEventListener("keydown", (e) => {

        if (!e.repeat) {
            if (!game_over && !ready_go_screen) {
                if (!paused) {
                    switch (e.key) {
                        case Config.KEYBINDS['move_left']:

                            move_piece(board, curr_piece, -1, 0);
                            moving_left = true;
                            last_move_side_time = now;
                            if (!inital_move_side_done) {
                                inital_move_side_done = true;
                                last_move_side_pressed = now;
                            }
                            break;
                        case Config.KEYBINDS['move_right']:
                            move_piece(board, curr_piece, 1, 0);
                            moving_right = true;
                            last_move_side_time = now;
                            if (!inital_move_side_done) {
                                inital_move_side_done = true;
                                last_move_side_pressed = now;
                            }
                            break;
                        case Config.KEYBINDS['softdrop']:
                            move_piece(board, curr_piece, 0, 1);
                            moving_down = true;
                            last_move_down_time = now;
                            break;
                        case Config.KEYBINDS['harddrop']:
                            let i = 1;
                            for (i = 1; i < Config.BOARD_HEIGHT; i++) {
                                if (!is_valid_position(board, curr_piece, 0, i)) {
                                    break;
                                }
                            }
                            curr_piece['y'] += i - 1;
                            piece_placed = true;
                            moving_down = false;
                            moving_left = false;
                            moving_right = false;
                            break;
                        case Config.KEYBINDS['rotate_right']:
                            rotate_piece(board, curr_piece, 1);
                            break;
                        case Config.KEYBINDS['rotate_left']:
                            rotate_piece(board, curr_piece, -1);
                            break;
                        case Config.KEYBINDS['hold']:
                            if (swap_hold_avail) {
                                if (held_piece == null) {
                                    held_piece = {
                                        'shape': curr_piece['shape'], 'rotation': 0, 'x': 3, 'y': 3, 'color': curr_piece['color']
                                    };
                                    piece_held_this_turn = true;
                                } else {
                                    let temp_piece = curr_piece;
                                    curr_piece = held_piece;
                                    held_piece = {
                                        'shape': temp_piece['shape'], 'rotation': 0, 'x': 3, 'y': 3, 'color': temp_piece['color']
                                    };
                                }
                                swap_hold_avail = false;
                            }
                            break;
                        default:
                            break;
                    }
                    if (e == Config.KEYBINDS['pause']) {
                        paused = !paused;
                    } else if (e == Config.KEYBINDS['restart']) {
                        // add restart functionality
                    }
                }
            }
        }
    });

    // key pressed


}

// returns true if mved successfully, false otherwise
function move_piece(board, piece, adjx, adjy) {
    if (is_valid_position(board, piece, adjx, adjy)) {
        piece['x'] += adjx;
        piece['y'] += adjy;
        return true;
    }
    return false;
}


// rotates piece based on current position and roation while allowing for wall kicks
function rotate_piece(board, piece, adj_rot) {
    let len_rots = Pieces.PIECE_SHAPES[piece['shape']].length;
    let rot1 = piece['rotation'];
    // % operator is "bugged" with negative numbers, need workaround
    // let rot2 = (piece['rotation'] + adj_rot) % len_rots;
    let rot2 = (((piece['rotation'] + adj_rot) % len_rots) + len_rots) % len_rots;
    let i = -1;
    if (rot1 == 0 && rot2 == 1) {
        i = 0;
    } else if (rot1 == 1 && rot2 == 0) {
        i = 1;
    } else if (rot1 == 1 && rot2 == 2) {
        i = 2;
    } else if (rot1 == 2 && rot2 == 1) {
        i = 3;
    } else if (rot1 == 2 && rot2 == 3) {
        i = 4;
    } else if (rot1 == 3 && rot2 == 2) {
        i = 5;
    } else if (rot1 == 3 && rot2 == 0) {
        i = 6;
    } else if (rot1 == 0 && rot2 == 3) {
        i = 7;
    }

    if (piece['shape'] == 'J' || piece['shape'] == 'L' || piece['shape'] == 'S' ||
        piece['shape'] == 'T' || piece['shape'] == 'Z') {
        for (let a = 0; a < Pieces.WALLKICK_JLSTZ.length; a++) {
            piece['rotation'] = rot2; // set new rotation
            // adjust x, y according to tests
            let testx = Pieces.WALLKICK_JLSTZ[a][0];
            let testy = Pieces.WALLKICK_JLSTZ[a][1];
            piece['x'] += testx;
            piece['y'] -= testy; // -= because positive y in test goes up
            if (is_valid_position(board, piece)) {
                break;
            }
            // test didnt work, undo
            piece['rotation'] = rot1;
            piece['x'] -= testx;
            piece['y'] += testy;

        }
    } else if (piece['shape'] == 'I') {
        for (let a = 0; a < Pieces.WALLKICK_I.length; a++) {
            piece['rotation'] = rot2;
            let testx = Pieces.WALLKICK_I[a][0];
            let testy = Pieces.WALLKICK_I[a][1];
            piece['x'] += testx;
            piece['y'] -= testy;
            if (is_valid_position(board, piece)) {
                break;
            }
            piece['rotation'] = rot1;
            piece['x'] -= testx;
            piece['y'] += testy;
        }
    }
}

// returns true if the given position with adjx and y is within the board
function is_valid_position(board, piece, adjx = 0, adjy = 0) {
    try {
        let template = Pieces.PIECE_SHAPES[piece['shape']][piece['rotation']];
        for (let yrow = 0; yrow < template.length; yrow++) {
            for (let xcol = 0; xcol < template[0].length; xcol++) {
                let piece_x = xcol + piece['x'] + adjx;
                let piece_y = yrow + piece['y'] + adjy;
                let is_above_board = piece_y < 0;
                if (is_above_board || template[yrow][xcol] == Config.BLANK) {
                    continue;
                }
                if (!is_on_board(piece_y, piece_x)) {
                    return false;
                }
                if (board[piece_y][piece_x] != Config.BLANK) {
                    return false;
                }
            }
        }
        return true;
    } catch (e) {
        console.error(board);
        console.error(piece);
    }
}


// removes any complete lines and pushes down the rest of the board;
// returns the number of removed lines;
function remove_complete_lines(board) {
    let num_removed_lines = 0;
    let yrow = Config.BOARD_HEIGHT - 1;
    while (yrow >= 0) {
        if (is_complete_line(board, yrow)) {
            for (let pull_down_y = yrow; pull_down_y > 0; pull_down_y--) {
                for (let xcol = 0; xcol < Config.BOARD_WIDTH; xcol++) {
                    board[pull_down_y][xcol] = board[pull_down_y - 1][xcol];
                }
            }
            for (let xcol = 0; xcol < Config.BOARD_WIDTH; xcol++) {
                board[0][xcol] = Config.BLANK;
            }
            num_removed_lines += 1;
        }
        else {
            yrow -= 1;
        }
    }
    return num_removed_lines;
}


// returns true if given row is full
function is_complete_line(board, yrow) {
    for (let xcol = 0; xcol < Config.BOARD_WIDTH; xcol++) {
        if (board[yrow][xcol] == Config.BLANK) {
            return false;
        }
    }
    return true;
}

// returns true if given x y is within board
function is_on_board(yrow, xcol) {
    return (0 <= xcol && xcol < Config.BOARD_WIDTH && yrow < Config.BOARD_HEIGHT);
}

// solidifies a piece onto the current board state
function add_to_board(board, piece) {
    let template = Pieces.PIECE_SHAPES[piece['shape']][piece['rotation']];
    for (let yrow = 0; yrow < template.length; yrow++) {
        for (let xcol = 0; xcol < template[0].length; xcol++) {
            if (template[yrow][xcol] != Config.BLANK) {
                board[yrow + piece['y']][xcol + piece['x']] = piece['shape'];
            }
        }
    }
}


// returns a new piece from the current bag of pieces
function get_new_piece(piece_bag) {
    let index = Math.floor(Math.random() * piece_bag.length);
    let shape = piece_bag[index];
    if (index > -1) { // only splice array when item is found
        piece_bag.splice(index, 1); // 2nd parameter means remove one item only
    }
    let new_piece = {
        'shape': shape, 'rotation': 0, 'x': 3, 'y': 3, 'color': Config.PIECE_COLORS[shape]
    };
    return new_piece;
}

function new_board() {
    let board = [];
    for (let yrow = 0; yrow < Config.BOARD_HEIGHT; yrow++) {
        let row = [];
        for (let xcol = 0; xcol < Config.BOARD_WIDTH; xcol++) {
            row.push(Config.BLANK);
        }
        board.push(row);
    }
    return board;
}


// draw text

// draw background
function draw_bg() {
    bgctx.lineWidth = 1;
    // Draw gridlines
    bgctx.strokeStyle = Config.GRID_SHADOW;
    bgctx.beginPath();
    // Vertical lines
    for (let x = 0; x <= Config.BOARD_WIDTH; x++) {
        bgctx.moveTo(x * Config.BOX_SIZE + 0.5, 0.5);
        bgctx.lineTo(x * Config.BOX_SIZE + 0.5, bgCanvas.height + 0.5);
    }
    // Horizontal lines
    for (let y = 0; y <= Config.VISIBLE_BOARD_HEIGHT; y++) {
        bgctx.moveTo(0.5, y * Config.BOX_SIZE + 0.5);
        bgctx.lineTo(bgCanvas.width + 0.5, y * Config.BOX_SIZE + 0.5);
    }
    bgctx.stroke();

    bgctx.setLineDash([Config.BOX_SIZE*5/12, Config.BOX_SIZE*7/12])
    bgctx.strokeStyle = Config.GRID_HIGHLIGHT;
    bgctx.lineDashOffset = Config.BOX_SIZE*5/26;
    bgctx.stroke();

}


// draw box
function draw_box(yrow, xcol, color){
    gamectx.fillStyle = color;
    gamectx.fillRect(xcol * Config.BOX_SIZE + 1, yrow * Config.BOX_SIZE + 1, Config.BOX_SIZE - 1, Config.BOX_SIZE - 1);
}

function erase_board(){
    gamectx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// draw board

function draw_board(board){
    for(let yrow = Config.BOARD_HEIGHT - Config.VISIBLE_BOARD_HEIGHT; yrow < Config.BOARD_HEIGHT; yrow++){
        for(let xcol = 0; xcol < Config.BOARD_WIDTH; xcol++){
            if(board[yrow][xcol] != Config.BLANK){
                draw_box(yrow + Config.VISIBLE_BOARD_HEIGHT - Config.BOARD_HEIGHT, xcol, Config.PIECE_COLORS[board[yrow][xcol]]);
            }
        }
    }
}

// draw next pieces
function draw_next_pieces(next_pieces){

}
// draw held pieces
function draw_held_piece(piece){
    
}
// draw piece
function draw_piece(piece){
    const template = Pieces.PIECE_SHAPES[piece['shape']][piece['rotation']];
    for(let yrow = 0; yrow < template.length; yrow++){
        for(let xcol = 0; xcol < template[0].length; xcol++){
            if(template[yrow][xcol] != Config.BLANK){
                if (yrow + piece['y'] + Config.VISIBLE_BOARD_HEIGHT - Config.BOARD_HEIGHT >= 0){
                    draw_box(yrow + piece['y'] + Config.VISIBLE_BOARD_HEIGHT - Config.BOARD_HEIGHT, xcol + piece['x'], piece['color']);
                }
            }
        }
    }
}
// draw piece shadow
function draw_piece_shadow(board, piece){
    let i;
    for(i = 1; i < Config.BOARD_HEIGHT; i++){
        if(!is_valid_position(board, piece, 0, i)){
            break;
        }
    }
    let shadow = {'shape': piece['shape'], 'rotation': piece['rotation'],
              'x': piece['x'], 'y': piece['y'] + i - 1, 'color': Config.SHADOW_COLORS[piece['shape']]};
    draw_piece(shadow);
}

// convert to pixel coords

function print_board(board) {
    let b = ""
    for (let yrow = 0; yrow < board.length; yrow++) {
        let row = "";
        for (let xcol = 0; xcol < board[0].length; xcol++) {
            if (board[yrow][xcol] == Config.BLANK) {
                row += '.';
            } else {
                row += board[yrow][xcol];
            }
        }
        b += row + "\n";
    }
    console.log(b);
}

function print_board_with_piece(board, piece) {
    let template = Pieces.PIECE_SHAPES[piece['shape']][piece['rotation']];
    let xys = [];
    for (let template_yrow = 0; template_yrow < template.length; template_yrow++) {
        for (let template_xcol = 0; template_xcol < template[0].length; template_xcol++) {
            if (template[template_yrow][template_xcol] != Config.BLANK) {
                xys.push([template_yrow + piece['y'], template_xcol + piece['x']]);
            }
        }
    }
    let b = "";
    for (let yrow = 0; yrow < board.length; yrow++) {
        for (let xcol = 0; xcol < board[0].length; xcol++) {
            let inxys = false;
            for (let i = 0; i < xys.length; i++) {
                if (xys[i][0] == yrow && xys[i][1] == xcol) {
                    inxys = true;
                    break;
                }
            }
            if (inxys) {
                b += piece['shape'];
            } else if (board[yrow][xcol] != Config.BLANK) {
                b += board[yrow][xcol];
            } else {
                b += '.';
            }
        }
        b += "\n";
    }
    console.log(b);
}