import Tetris from "./not used/Tetris.js";
import * as Config from "./Config.js";
import TetrisAI from "./not used/TetrisAI.js";
import Renderer from "./Renderer.js";
import Environment from "./Environment.js";
import Agent from "./Agent.js";
import * as GeneticAlgorithm from "./GeneticAlgorithm.js";


const rows = 4;
const cols = 6;
const totalPopulation = rows * cols;


let allGames = [];
let aliveGames = [];

let generation = 1;
let generationSpan;

let numEpochs = 20;
let numSteps = 100;


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
        if (col == cols) {
            col = 0;
            row++;
        }
        if (row == rows) {
            row = 0;
            col = 0;
        }
        allGames.push({ 'Agent': agent, 'Env': env, 'Renderer': renderer });
    }
    aliveGames = allGames.slice();
}


async function start() {
    setup();
    let natFallCounter = 0;
    for (let e = 0; e < numEpochs; e++) {
        for (let i = 0; i < numSteps; i++) {
            draw(e, i);
            await delay(100);
            natFallCounter += 1;
            if (natFallCounter == 2) {
                // natural fall all boards;
                // console.log("natural fall");
                for (let i = 0; i < aliveGames.length; i++) {
                    aliveGames[i]['Env'].naturalFall();
                }
                natFallCounter = 0;
            }
            // on certain delays, force natural fall
        }
        generation++;
    }
}

function draw(epoch, step) {

    // console.log(aliveAgents);
    for (let i = aliveGames.length - 1; i >= 0; i--) {
        let agent = aliveGames[i]['Agent'];
        let env = aliveGames[i]['Env'];

        agent.chooseAction(env.getState());
        agent.update();

        if (env.isDone()) {
            // console.log(`agent ${i} is dead`);
            aliveGames.splice(i, 1);
        }
    }


    // console.log(`epoch: ${epoch}, step: ${step}`);

    if (aliveGames.length == 0 || step == numSteps - 1) {
        generation++;
        allGames = GeneticAlgorithm.createNextGeneration(allGames);
        aliveGames = allGames.slice();
    }

    for (let i = 0; i < aliveGames.length; i++) {
        aliveGames[i]['Renderer'].drawGame(aliveGames[i]['Env'].gameState, aliveGames[i]['Env'].gameStats);
    }
}


function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

start();

// for (let row = 0; row < 4; row++) {
//     for (let col = 0; col < 6; col++) {
//         const agt = new Agent();
//         const env = new Environment();
//         const renderer = new Renderer(tetrisCanvas, col, row);
//         renderer.drawGame(env.tetris.getGameState(), env.tetris.getGameStats());
//     }
// }
