import TetrisGame from "./TetrisGame.js";
import * as Constants from "./GameConstants.js";
import * as Config from "./Config.js";
import Board from "./Board.js";
import Piece from "./Piece.js";
import PieceQueue from "./PieceQueue.js";

// let b = new Board();
// let p = new Piece("T");

// console.log(b.toStringWithPiece(p));
// console.log(b.isValidPosition(p));

let game1 = new TetrisGame();
game1.start();


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
// const gameStatsCanvas = document.getElementById("gameStatsCanvas");
// const gameStatsctx = gameStatsCanvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
const settingsButton = document.getElementById("settingsButton");
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

restartButton.addEventListener('click', () => {

});

settingsButton.addEventListener('click', () => {
    // config should be changed to json and be able to be read/write
    // open up a settings menu where you can change config
});
function addKeyEventListeners() {
    maindiv.addEventListener("keyup", (e) => {
        if (!e.repeat) {
            switch (e.key) {
                case Config.KEYBINDS['move_left']:
                    break;
                case Config.KEYBINDS['move_right']:
                    break;
                case Config.KEYBINDS['softdrop']:
                    break;
                default:
                    break;
            }
        }
    });
    maindiv.addEventListener("keydown", (e) => {

        if (!e.repeat) {
            switch (e.key) {
                case Config.KEYBINDS['move_left']:
                    game1.handleInputs(["MoveLeft"]);
                    break;
                case Config.KEYBINDS['move_right']:
                    game1.handleInputs(["MoveRight"]);
                    break;
                case Config.KEYBINDS['softdrop']:
                    game1.handleInputs(["Softdrop"]);
                    break;
                case Config.KEYBINDS['harddrop']:
                    game1.handleInputs(["Harddrop"]);
                    break;
                case Config.KEYBINDS['rotate_right']:
                    game1.handleInputs(["RotateCW"]);
                    break;
                case Config.KEYBINDS['rotate_left']:
                    game1.handleInputs(["RotateCCW"]);
                    break;
                case Config.KEYBINDS['hold']:
                    game1.handleInputs(["Hold"]);
                    break;
                case Config.KEYBINDS['pause']:
                    game1.handleInputs(["Pause"]);
                    break;
                case Config.KEYBINDS['restart']:
                    game1.handleInputs(["Restart"]);
                    break;
                default:
                    break;
            }
        }

    });
}
