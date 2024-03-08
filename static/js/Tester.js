import Piece from "./Piece.js";
import Tetris from "./Tetris.js";
import TetrisBaseGame from "./TetrisBaseGame.js";
import * as Config from "./Config.js";

// const font = new FontFace(Config.TEXT_FONT, 'url(' + Config.TEXT_FONT_LOCATION + ')');
// document.fonts.add(font);
// font.load();
// document.fonts.ready.then(() => {
// });

let game = new Tetris(document.getElementById("game1"));
game.start();

let game2 = new Tetris(document.getElementById("game2"));
game2.start();

let game3 = new Tetris(document.getElementById("game3"));
game3.start();