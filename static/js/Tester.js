import Tetris from "./not used/Tetris.js";
import * as Config from "./Config.js";
import TetrisAI from "./not used/TetrisAI.js";
import Renderer from "./Renderer.js";
import Environment from "./Environment.js";
import Agent from "./Agent.js";


const rows = 3;
const cols = 5;
const totalPopulation = rows * cols;
let aliveAgents = [];
let aliveEnvs = [];
let aliveRenderers = []
let allEnvs = [];
let allAgents = [];
let allRenderers = [];
let generation = 1;
let generationSpan;

function preload() {
    const font = new FontFace(Config.TEXT_FONT, 'url(' + Config.TEXT_FONT_LOCATION + ')');
    font.load().then(
        () => {
            document.fonts.add(font);

        },
        (err) => {
            console.error(err);
        },
    );
}

function setup() {
    let canvas = document.getElementById('tetris-canvas');
    let row = 0; 
    let col = 0;
    for (let i = 0; i < totalPopulation; i++) {
        let env = new Environment();
        let agent = new Agent(null, env);
        let renderer = new Renderer(canvas, col, row);
        col++;
        if(col == cols){
            col = 0;
            row++;
        }
        if(row == rows){
            row = 0;
            col = 0;
        }
        aliveAgents[i] = agent;
        aliveEnvs[i] = env;
        aliveRenderers[i] = renderer;
        allAgents[i] = agent;
        allEnvs[i] = env;
        allRenderers[i] = renderer;
    }
}

function draw() {


    for (let i = aliveAgents.length - 1; i >= 0; i--) {
        let agent = aliveAgents[i];
        let env = aliveEnvs[i];
        
        agent.chooseAction(aliveEnvs[i].getState());
        agent.update();

        // console.log(env);
        if (env.isDone()) {
            console.log(`agent ${i} is dead`);
            aliveAgents.splice(i, 1);
            aliveEnvs.splice(i, 1);
            aliveRenderers.splice(i, 1);
        }
    }

    

    if (aliveAgents.length == 0) {
        generation++;
        createNextGeneration();
    }

    for (let i = 0; i < allRenderers.length; i++) {
        allRenderers[i].drawGame(allEnvs[i].gameState, allEnvs[i].gameStats);
    }
}

setup();
draw();


// for (let row = 0; row < 4; row++) {
//     for (let col = 0; col < 6; col++) {
//         const agt = new Agent();
//         const env = new Environment();
//         const renderer = new Renderer(tetrisCanvas, col, row);
//         renderer.drawGame(env.tetris.getGameState(), env.tetris.getGameStats());
//     }
// }
