import Tetris from "./Tetris.js";
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


const env = new TetrisAI();
const renderer = new Renderer(tetrisCanvas);
const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
});


renderer.drawGame(env.getGameState(), env.getGameStats());
await delay(1000);

env.setInput(0);
env.update();

renderer.drawGame(env.getGameState(), env.getGameStats());