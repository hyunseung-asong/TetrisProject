import Tetris from "./Tetris.js";
import * as Config from "./Config.js";

const font = new FontFace(Config.TEXT_FONT, 'url(' + Config.TEXT_FONT_LOCATION + ')');
font.load().then(
    () => {
        document.fonts.add(font);
        let game = new Tetris(document.getElementById("game1"));
        game.start();

    },
    (err) => {
        console.error(err);
    },
);

// let game2 = new Tetris(document.getElementById("game2"));
// game2.start();

// let game3 = new Tetris(document.getElementById("game3"));
// game3.start();