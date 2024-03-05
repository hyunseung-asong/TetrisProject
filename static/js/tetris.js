import * as Pieces from './pieces.js';
import * as Config from './config.js';

const maindiv = document.getElementById("main");
const bgdiv = document.getElementById("background");
const bgCanvas = document.getElementById("bgCanvas");
const bgctx = bgCanvas.getContext("2d");
const gameCanvas = document.getElementById("gameCanvas");
const gamectx = gameCanvas.getContext("2d");
const holdCanvas = document.getElementById("holdCanvas");
const holdctx = holdCanvas.getContext("2d");
const queueCanvas = document.getElementById("queueCanvas");
const queuectx = queueCanvas.getContext("2d");
const scoreTextCanvas = document.getElementById("scoreTextCanvas");
const scoreTextctx = scoreTextCanvas.getContext("2d");
const holdTextCanvas = document.getElementById("holdTextCanvas");
const holdTextctx = holdTextCanvas.getContext("2d");
const queueTextCanvas = document.getElementById("queueTextCanvas");
const queueTextctx = queueTextCanvas.getContext("2d");
const gameStatsCanvas = document.getElementById("gameStatsCanvas");
const gameStatsctx = gameStatsCanvas.getContext("2d");
// draw_box(0, 0, Config.PIECE_COLORS['I']);
// draw_box(1, 0, Config.PIECE_COLORS['I']);
// draw_box(0, 1, Config.PIECE_COLORS['I']);
// draw_box(1, 1, Config.PIECE_COLORS['I']);
// draw_box(2, 2, Config.PIECE_COLORS['I']);
window.addEventListener('load', () => {

    maindiv.focus();
    addKeyEventListeners();
    maindiv.addEventListener("click", () => {
        maindiv.focus();
    });
    bgdiv.addEventListener("click", () => {
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

let score;
let game_over;
let paused;
let ready_go_screen;
let draw_ready;
let draw_go;
let ready_screen_time;

let initial_move_side_done;
let last_move_down_time;
let last_move_side_time;
let last_move_side_pressed;
let last_fall_time;

// key presses
let holding_move_left;
let holding_move_right;
let holding_softdrop;
let pressed_harddrop;
let pressed_rotate_left;
let pressed_rotate_right;
let pressed_hold;

let piece_placed;
let swap_hold_avail;
let piece_held_this_turn;

let totalLinesCleared;
let level;
let currentCombo;
let maxCombo;
let tst_or_fin_kick;
let piece_moved;
let rotation_before_movement_occured;
let down_movement_occured;
let down_movement_type;
let down_movement_lines;
let back_to_back;
let prev_clear_action;


const font = new FontFace(Config.TEXT_FONT, 'url(' + Config.TEXT_FONT_LOCATION + ')');
document.fonts.add(font);
font.load();
document.fonts.ready.then(() => {
    init();
});


// Game initialization
function init() {
    // board state variables
    draw_bg();
    draw_text(holdTextctx, "HOLD", Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW,
        holdTextCanvas.width / 2, holdTextCanvas.height, "center", "bottom");
    draw_text(queueTextctx, "NEXT", Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW,
        queueTextCanvas.width / 2, queueTextCanvas.height, "center", "bottom");

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
    score = 0;
    totalLinesCleared = 0;
    level = 1;
    currentCombo = -1;
    maxCombo = 0;

    tst_or_fin_kick = false;
    piece_moved = false;
    rotation_before_movement_occured = false;
    down_movement_occured = false;
    down_movement_type = "None";
    down_movement_lines = 0;
    back_to_back = false;
    prev_clear_action = "None";

    initial_move_side_done = false;
    last_move_down_time = Date.now();
    last_move_side_time = Date.now();
    last_move_side_pressed = Date.now();
    last_fall_time = Date.now();

    // key presses
    holding_move_left = false;
    holding_move_right = false;
    holding_softdrop = false;
    pressed_harddrop = false;
    pressed_rotate_left = false;
    pressed_rotate_right = false;
    pressed_hold = false;

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
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        then = now - (delta % interval);
        if (!game_over) {
            if (ready_go_screen) {
                countdown_ready_go();
            } else if (!paused) {
                get_next_piece();
                handle_piece_movement();
                update_board();
            }
        }
        update_canvases();
    }
    // if (!game_over) {
    requestAnimationFrame(update);
    // }
}

function addKeyEventListeners() {
    maindiv.addEventListener("keyup", (e) => {
        if (!e.repeat) {
            switch (e.key) {
                case Config.KEYBINDS['move_left']:
                    holding_move_left = false;
                    last_move_side_pressed = now;
                    initial_move_side_done = false;
                    break;
                case Config.KEYBINDS['move_right']:
                    holding_move_right = false;
                    last_move_side_pressed = now;
                    initial_move_side_done = false;
                    break;
                case Config.KEYBINDS['softdrop']:
                    holding_softdrop = false;
                    break;
                default:
                    break;
            }
        }
    });
    maindiv.addEventListener("keydown", (e) => {

        if (!e.repeat && !game_over && !ready_go_screen) {
            if (!paused) {
                switch (e.key) {
                    case Config.KEYBINDS['move_left']:
                        last_move_side_pressed = now;
                        holding_move_left = true;
                        break;
                    case Config.KEYBINDS['move_right']:
                        last_move_side_pressed = now;
                        holding_move_right = true;
                        break;
                    case Config.KEYBINDS['softdrop']:
                        holding_softdrop = true;
                        break;
                    case Config.KEYBINDS['harddrop']:
                        pressed_harddrop = true;
                        break;
                    case Config.KEYBINDS['rotate_right']:
                        pressed_rotate_right = true;
                        break;
                    case Config.KEYBINDS['rotate_left']:
                        pressed_rotate_left = true;
                        break;
                    case Config.KEYBINDS['hold']:
                        pressed_hold = true;
                        break;
                    default:
                        break;
                }
            }
            if (e.key == Config.KEYBINDS['pause']) {
                paused = !paused;
            } else if (e == Config.KEYBINDS['restart']) {
                // restart game
            }
        }

    });
}

// returns true if mved successfully, false otherwise
function move_piece(board, piece, adjx, adjy) {
    if (is_valid_position(board, piece, adjx, adjy)) {
        piece['x'] += adjx;
        piece['y'] += adjy;
        // movement_occured = true;
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
        for (let a = 0; a < Pieces.WALLKICK_JLSTZ[i].length; a++) {
            piece['rotation'] = rot2; // set new rotation
            // adjust x, y according to tests
            let testx = Pieces.WALLKICK_JLSTZ[i][a][0];
            let testy = Pieces.WALLKICK_JLSTZ[i][a][1];
            piece['x'] += testx;
            piece['y'] -= testy; // -= because positive y in test goes up
            if (is_valid_position(board, piece)) {
                if (piece['shape'] == 'T' && (i == 0 || i == 3 || i == 4 || i == 7) && a == 4) {
                    tst_or_fin_kick = true; // reset when piece placed or different rotation done
                }
                rotation_before_movement_occured = true;
                break;
            }
            // test didnt work, undo
            piece['rotation'] = rot1;
            piece['x'] -= testx;
            piece['y'] += testy;

        }
    } else if (piece['shape'] == 'I') {
        for (let a = 0; a < Pieces.WALLKICK_I[i].length; a++) {
            piece['rotation'] = rot2;
            let testx = Pieces.WALLKICK_I[i][a][0];
            let testy = Pieces.WALLKICK_I[i][a][1];
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
function draw_text(ctx, text, font, size, color, x, y, align = "center", baseline = "middle") {
    ctx.font = size + "px" + " " + font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

}

function draw_score(score) {
    let str = score.toString();
    str = str.padStart(7, "0");

    scoreTextctx.clearRect(0, 0, scoreTextCanvas.width, scoreTextCanvas.height);
    draw_text(scoreTextctx, "SCORE:", Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW,
        0, scoreTextCanvas.height, "left", "bottom");
    draw_text(scoreTextctx, str, Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW, scoreTextCanvas.width, scoreTextCanvas.height, "right", "bottom");
}


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

    bgctx.setLineDash([Config.BOX_SIZE * 5 / 12, Config.BOX_SIZE * 7 / 12])
    bgctx.strokeStyle = Config.GRID_HIGHLIGHT;
    bgctx.lineDashOffset = Config.BOX_SIZE * 5 / 26;
    bgctx.stroke();

}


// draw box
function draw_box(ctx, yrow, xcol, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(xcol * Config.BOX_SIZE + 1), Math.floor(yrow * Config.BOX_SIZE + 1), Config.BOX_SIZE - 1, Config.BOX_SIZE - 1);
}

function erase_board() {
    gamectx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    queuectx.clearRect(0, 0, queueCanvas.width, queueCanvas.height);
    holdctx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
}

// draw board

function draw_board(board) {
    for (let yrow = Config.BOARD_HEIGHT - Config.VISIBLE_BOARD_HEIGHT; yrow < Config.BOARD_HEIGHT; yrow++) {
        for (let xcol = 0; xcol < Config.BOARD_WIDTH; xcol++) {
            if (board[yrow][xcol] != Config.BLANK) {
                draw_box(gamectx, yrow + Config.VISIBLE_BOARD_HEIGHT - Config.BOARD_HEIGHT, xcol, Config.PIECE_COLORS[board[yrow][xcol]]);
            }
        }
    }
}

// draw next pieces
function draw_next_pieces(next_pieces) {
    for (let i = 0; i < next_pieces.length; i++) {
        let x = 0.5;
        let y = i * 3 + 0.5 + Config.BOARD_HEIGHT - Config.VISIBLE_BOARD_HEIGHT;
        if (next_pieces[i]['shape'] == 'I') {
            x = 0;
            y -= 0.5;
        } else if (next_pieces[i]['shape'] == 'O') {
            x = 0;
        }
        draw_piece(queuectx, next_pieces[i], x, y);
    }

}
// draw held pieces
function draw_held_piece(piece) {
    let x = 0.5;
    let y = 0.5 + Config.BOARD_HEIGHT - Config.VISIBLE_BOARD_HEIGHT;
    if (piece['shape'] == 'I') {
        x = 0;
        y -= 0.5;
    } else if (piece['shape'] == 'O') {
        x = 0;
    }
    draw_piece(holdctx, piece, x, y);
}
// draw piece
function draw_piece(ctx, piece, x, y) {
    const template = Pieces.PIECE_SHAPES[piece['shape']][piece['rotation']];
    for (let yrow = 0; yrow < template.length; yrow++) {
        for (let xcol = 0; xcol < template[0].length; xcol++) {
            if (template[yrow][xcol] != Config.BLANK) {
                if (yrow + y + Config.VISIBLE_BOARD_HEIGHT - Config.BOARD_HEIGHT >= 0) {
                    draw_box(ctx, yrow + y + Config.VISIBLE_BOARD_HEIGHT - Config.BOARD_HEIGHT, xcol + x, piece['color']);
                }
            }
        }
    }
}
// draw piece shadow
function draw_piece_shadow(board, piece) {
    let i;
    for (i = 1; i < Config.BOARD_HEIGHT; i++) {
        if (!is_valid_position(board, piece, 0, i)) {
            break;
        }
    }
    let shadow = {
        'shape': piece['shape'], 'rotation': piece['rotation'],
        'x': piece['x'], 'y': piece['y'] + i - 1, 'color': Config.SHADOW_COLORS[piece['shape']]
    };
    draw_piece(gamectx, shadow, shadow['x'], shadow['y']);
}

function copy_board(board) {
    let b = [];
    for (let yrow = 0; yrow < Config.BOARD_HEIGHT; yrow++) {
        let row = [];
        for (let xcol = 0; xcol < Config.BOARD_WIDTH; xcol++) {
            row.push(board[yrow][xcol]);
        }
        b.push(row);
    }
    return b;
}

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

function get_next_piece() {
    if (curr_piece == null) {
        curr_piece = next_pieces.shift();
        if (!is_valid_position(board, curr_piece)) {
            move_piece(board, curr_piece, 0, -1);
            rotation_before_movement_occured = false;
        }
        if (piece_bag.length == 0) {
            piece_bag = Object.keys(Pieces.PIECE_SHAPES);
        }
        next_pieces.push(get_new_piece(piece_bag));
    }
}

function handle_piece_movement() {
    if (holding_move_left || holding_move_right) {
        if (!initial_move_side_done) {
            if (holding_move_left) {
                if (move_piece(board, curr_piece, -1, 0)) {
                    rotation_before_movement_occured = false;
                    last_move_side_time = now;
                }
            }
            if (holding_move_right) {
                if (move_piece(board, curr_piece, 1, 0)) {
                    rotation_before_movement_occured = false;
                    last_move_side_time = now;
                }
            }
            initial_move_side_done = true;
            last_move_side_pressed = now;
        } else if (now - last_move_side_pressed > Config.MOVE_SIDEWAYS_OFFSET && now - last_move_side_time > Config.MOVE_SIDEWAYS_FREQ) {
            if (holding_move_left) {
                if (move_piece(board, curr_piece, -1, 0)) {
                    rotation_before_movement_occured = false;
                    last_move_side_time = now;
                }
            }
            if (holding_move_right) {
                if (move_piece(board, curr_piece, 1, 0)) {
                    rotation_before_movement_occured = false;
                    last_move_side_time = now;
                }
            }
        }
    }
    if (holding_softdrop) {
        if (now - last_move_down_time > Config.MOVE_DOWN_FREQ) {
            if (move_piece(board, curr_piece, 0, 1)) {
                rotation_before_movement_occured = false;
                down_movement_occured = true;
                down_movement_type = "Softdrop";
                down_movement_lines = 1;
                last_move_down_time = now;
                last_fall_time = now;
            }
        }
    }
    if (pressed_harddrop) {
        let i = 0;
        for (i = 0; i < Config.BOARD_HEIGHT; i++) {
            if (!is_valid_position(board, curr_piece, 0, i)) {
                break;
            }
        }
        move_piece(board, curr_piece, 0, i - 1);
        if (i - 1 > 0) {
            rotation_before_movement_occured = false;
            down_movement_occured = true;
            down_movement_type = "Harddrop";
            down_movement_lines = i - 1;
        } else {
            // didnt move
        }
        piece_placed = true;
        pressed_harddrop = false;

    }
    if (pressed_rotate_left) {
        tst_or_fin_kick = false;
        rotate_piece(board, curr_piece, -1);
        pressed_rotate_left = false;
    }
    if (pressed_rotate_right) {
        tst_or_fin_kick = false;
        rotate_piece(board, curr_piece, 1);
        pressed_rotate_right = false;
    }
    if (pressed_hold) {
        if (swap_hold_avail) {
            let temp_piece = held_piece; // temp = i
            held_piece = { // t
                'shape': curr_piece['shape'], 'rotation': 0, 'x': 3, 'y': 3, 'color': curr_piece['color']
            };
            curr_piece = temp_piece;
            piece_held_this_turn = true;
            swap_hold_avail = false;
        }
        pressed_hold = false;
    }
    // let piece fall naturally
    if (now - last_fall_time > Config.FALL_FREQ) {
        if (move_piece(board, curr_piece, 0, 1)) {
            rotation_before_movement_occured = false;
            last_fall_time = now;
        } else {
            piece_placed = true;
        }
    }
}

function countdown_ready_go() {
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

function num_tspin_corners(board, piece) {
    if (piece['shape'] != 'T') {
        return [0, 0];
    }
    // (x,y)
    // (0,0) (1,0) (2,0)
    //   ^           ^
    // (0,1) (1,1) (2,1) 
    //   v           v
    // (0,2) (1,2) (2,2)
    let cornersFilled = 0;
    let cornersFacing = 0;
    let corners = [[0, 0], [2, 0], [0, 2], [2, 2]];
    for (let i = 0; i < corners.length; i++) {
        let cornerx = piece['x'] + corners[i][1];
        let cornery = piece['y'] + corners[i][0];
        if (-1 <= cornerx <= Config.BOARD_WIDTH && -1 <= cornery <= Config.BOARD_HEIGHT) {
            if (cornerx == -1 || cornerx == Config.BOARD_WIDTH || cornery == -1 || cornery == Config.BOARD_HEIGHT) {
                cornersFilled += 1;
            } else if (board[cornery][cornerx] != Config.BLANK) {
                cornersFilled += 1;
            }
        }

    }

    let rotation = piece['rotation'];
    let checkCorners = { 0: [0, 1], 1: [0, 3], 2: [2, 3], 3: [0, 2] };
    let piecex = piece['x'];
    let piecey = piece['y'];
    if (piecey + corners[checkCorners[rotation][0]][1] < Config.BOARD_HEIGHT && piecex + corners[checkCorners[rotation][0]][0] < Config.BOARD_WIDTH) {
        if (board[piecey + corners[checkCorners[rotation][0]][1]][piecex + corners[checkCorners[rotation][0]][0]] != Config.BLANK) {
            cornersFacing += 1;
        }
    }
    if (piecey + corners[checkCorners[rotation][1]][1] < Config.BOARD_HEIGHT && piecex + corners[checkCorners[rotation][1]][0] < Config.BOARD_WIDTH) {
        if (board[piecey + corners[checkCorners[rotation][1]][1]][piecex + corners[checkCorners[rotation][1]][0]] != Config.BLANK) {
            cornersFacing += 1;
        }
    }

    return [cornersFilled, cornersFacing];

}

function update_score(linesCleared, piece, board, drop_type, lines_moved) {
    let curr_clear_action = "None";
    if (drop_type == "Softdrop") {
        score += Config.ACTION_SCORE["Softdrop"];
        return;
    } else if (drop_type == "Harddrop") {
        score += Config.ACTION_SCORE["Harddrop"] * lines_moved;
        return;
    } else {
        if (piece['shape'] == 'T' && rotation_before_movement_occured) {
            let tspin_calc = num_tspin_corners(board, piece);
            let cornersFilled = tspin_calc[0];
            let cornersFacing = tspin_calc[1];
            if (cornersFacing == 2 || tst_or_fin_kick) {
                if (cornersFilled == 3 || cornersFilled == 4) {
                    if (linesCleared == 0) {
                        curr_clear_action = "T-Spin no lines";
                    } else if (linesCleared == 1) {
                        curr_clear_action = "T-Spin Single";
                    } else if (linesCleared == 2) {
                        curr_clear_action = "T-Spin Double";
                    } else if (linesCleared == 3) {
                        curr_clear_action = "T-Spin Triple";
                    }
                }
            } else if (cornersFacing == 1) {
                if (cornersFilled == 3 || cornersFilled == 4) {
                    if (linesCleared == 0) {
                        curr_clear_action = "Mini T-Spin no lines";
                    } else if (linesCleared == 1) {
                        curr_clear_action = "Mini T-Spin Single";
                    } else if (linesCleared == 2) {
                        curr_clear_action = "Mini T-Spin Double";
                    }
                }
            }
        } else if (curr_clear_action == "None") { // did not satisfy tspin
            if (linesCleared == 1) {
                if (board_empty(board)) {
                    curr_clear_action = "Single PC";
                } else {
                    curr_clear_action = "Single";
                }
            } else if (linesCleared == 2) {
                if (board_empty(board)) {
                    curr_clear_action = "Double PC";
                } else {
                    curr_clear_action = "Double";
                }
            } else if (linesCleared == 3) {
                if (board_empty(board)) {
                    curr_clear_action = "Triple PC";
                } else {
                    curr_clear_action = "Triple";
                }
            } else if (linesCleared == 4) {
                if (board_empty(board)) {
                    curr_clear_action = "Tetris PC";
                } else {
                    curr_clear_action = "Tetris";
                }
            }
        }
    }
    let clearOutput = "";
    let tempScore = Config.ACTION_SCORE[curr_clear_action];
    let difficult = Config.ACTION_DIFFICULTY[curr_clear_action];
    let b2bChainBreak = Config.ACTION_BACK_TO_BACK_CHAIN_BREAK[curr_clear_action];

    if (back_to_back && difficult) {
        clearOutput += "B2B ";
        if (curr_clear_action == "Tetris PC") {
            tempScore = Config.ACTION_SCORE['B2B Tetris PC'];
        } else if (difficult) {
            tempScore *= 1.5;
        }
    }
    clearOutput += curr_clear_action;
    if (linesCleared != 0) {
        currentCombo += 1;
        if (currentCombo > maxCombo) {
            maxCombo = currentCombo;
        }
        if(currentCombo > 0){
            clearOutput += " Combo " + currentCombo;
        }
        tempScore += Config.ACTION_SCORE['Combo'] * currentCombo;
    } else {
        currentCombo = -1;
    }
    tempScore *= level;
    score += tempScore;
    prev_clear_action = curr_clear_action;

    if (difficult) {
        back_to_back = true;
    } else if (b2bChainBreak) {
        back_to_back = false;
    }

    if(clearOutput != "None"){
        console.log(clearOutput);
    }
}

function board_empty(board) {
    for (let yrow = Config.BOARD_HEIGHT - 1; yrow >= 0; yrow--) {
        for (let xcol = 0; xcol < Config.BOARD_WIDTH; xcol++) {
            if (board[yrow][xcol] != Config.BLANK) {
                return false;
            }
        }
    }
    return true;
}

function update_board() {
    // only check lines cleared and score when any down movement is done
    // keep track of last rotation and last down movement.
    // if rotation is done right before down movement, it could count for tspins.
    // need to know which rotation test tspin completed. if rotation test was right before piece placed, could count as tspin.
    if (down_movement_occured) {
        update_score(0, null, board, down_movement_type, down_movement_lines);
        down_movement_occured = false;
        down_movement_type = "None";
        down_movement_lines = 0;
    }

    if (piece_placed) {
        if (!is_valid_position(board, curr_piece, 0, 0)) {
            game_over = true;
        } else {
            add_to_board(board, curr_piece);
            let temp_board = copy_board(board);
            let linesCleared = remove_complete_lines(board);
            update_score(linesCleared, curr_piece, temp_board, "None", false);
            totalLinesCleared += linesCleared;
            level = Math.floor(totalLinesCleared / 10) + 1;
            curr_piece = null;
            piece_placed = false;
            swap_hold_avail = true;
            last_fall_time = now;
            last_move_side_time = now;
            last_move_side_pressed = now;
            last_move_down_time = now;
            tst_or_fin_kick = false;
        }
    }
    if (piece_held_this_turn) {
        piece_held_this_turn = false;
    }
}

function update_canvases() {
    erase_board();
    draw_board(board);
    draw_score(score);
    if (curr_piece != null) {
        draw_piece_shadow(board, curr_piece);
        draw_piece(gamectx, curr_piece, curr_piece['x'], curr_piece['y']);
    }
    if (next_pieces != null) {
        draw_next_pieces(next_pieces);
    }
    if (held_piece != null) {
        draw_held_piece(held_piece);
    }
    if (draw_ready) {
        draw_text(gamectx, "READY", Config.TEXT_FONT, Config.FONT_SIZE_LARGE, Config.FONT_COLOR_YELLOW,
            Config.BOARD_WIDTH / 2 * Config.BOX_SIZE, Config.VISIBLE_BOARD_HEIGHT / 2 * Config.BOX_SIZE);
    }
    if (draw_go) {
        draw_text(gamectx, "GO!", Config.TEXT_FONT, Config.FONT_SIZE_LARGE, Config.FONT_COLOR_YELLOW,
            Config.BOARD_WIDTH / 2 * Config.BOX_SIZE, Config.VISIBLE_BOARD_HEIGHT / 2 * Config.BOX_SIZE);
    }
    if (paused) {
        draw_text(gamectx, "PAUSED", Config.TEXT_FONT, Config.FONT_SIZE_LARGE, Config.FONT_COLOR_YELLOW,
            Config.BOARD_WIDTH / 2 * Config.BOX_SIZE, Config.VISIBLE_BOARD_HEIGHT / 2 * Config.BOX_SIZE);
    }
}
