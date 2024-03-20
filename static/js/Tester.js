import Tetris from "./tetris.js";
import * as Config from "./Config.js";
import TetrisAI from "./TetrisAI.js";
import Renderer from "./Renderer.js";


const tetrisCanvas = document.getElementById('tetris-canvas');

const font = new FontFace(Config.TEXT_FONT, 'url(' + Config.TEXT_FONT_LOCATION + ')');
font.load().then(
    () => {
        document.fonts.add(font);

    },
    (err) => {
        console.error(err);
    },
);


const env = new Tetris(tetrisCanvas);
const renderer = new Renderer(tetrisCanvas);

env.start();
// console.log(env.game.currPiece);
// console.log(env.game.board.toStringWithPiece(env.game.currPiece));
// const allBoards = env.game.getAllBoardStates();
// console.log(allBoards);