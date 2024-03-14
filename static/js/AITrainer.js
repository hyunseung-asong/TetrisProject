import Tetris from "./Tetris.js";
import * as Config from "./Config.js";
import TetrisAI from "./TetrisAI.js";
import Renderer from "./Renderer.js";

import { SaveablePolicyNetwork } from './PolicyNetwork.js';
import { mean, sum } from './utils.js';

const appStatus = document.getElementById('app-status');
const storedModelStatusInput = document.getElementById('stored-model-status');
const hiddenLayerSizesInput = document.getElementById('hidden-layer-sizes');
const createModelButton = document.getElementById('create-model');
const uploadModelButton = document.getElementById('upload-model');
const deleteStoredModelButton = document.getElementById('delete-stored-model');
const tetrisCanvas = document.getElementById('tetris-canvas');

const numIterationsInput = document.getElementById('num-iterations');
const gamesPerIterationInput = document.getElementById('games-per-iteration');
const discountRateInput = document.getElementById('discount-rate');
const maxStepsPerGameInput = document.getElementById('max-steps-per-game');
const learningRateInput = document.getElementById('learning-rate');
const renderDuringTrainingCheckbox = document.getElementById('render-during-training');

const trainButton = document.getElementById('train');
const testButton = document.getElementById('test');
const iterationStatus = document.getElementById('iteration-status');
const iterationProgress = document.getElementById('iteration-progress');
const trainStatus = document.getElementById('train-status');
const trainSpeed = document.getElementById('train-speed');
const trainProgress = document.getElementById('train-progress');

const stepsContainer = document.getElementById('steps-container');

const tetrisRenderer = new Renderer(tetrisCanvas);
let policyNet;
let stopRequested = false;

const font = new FontFace(Config.TEXT_FONT, 'url(' + Config.TEXT_FONT_LOCATION + ')');
font.load().then(
    () => {
        document.fonts.add(font);
    },
    (err) => {
        console.error(err);
    },
);


function logStatus(message) {
    appStatus.textContent = message;
}

let renderDuringTraining = true;
export async function maybeRenderDuringTraining(tetrisEnv) {
    if (renderDuringTraining) {
        tetrisRenderer.drawGame(tetrisEnv.getGameState(), tetrisEnv.getGameStats());
        await tf.nextFrame();
    }
}

export function onGameEnd(gameCount, totalGames) {
    iterationStatus.textContent = `Game ${gameCount} of ${totalGames}`;
    iterationProgress.value = gameCount / totalGames * 100;
    if (gameCount === totalGames) {
        iterationStatus.textContent = 'Updating weights...';
    }
}
function onIterationEnd(iterationCount, totalIterations) {
    trainStatus.textContent = `Iteration ${iterationCount} of ${totalIterations}`;
    trainProgress.value = iterationCount / totalIterations * 100;
}


let meanStepValues = [];
function plotSteps() {
    tfvis.render.linechart(stepsContainer, { values: meanStepValues }, {
        xLabel: 'Training Iteration',
        yLabel: 'Mean Steps Per Game',
        width: 400,
        height: 300,
    });
}

function disableModelControls() {
    trainButton.textContent = 'Stop';
    testButton.disabled = true;
    deleteStoredModelButton.disabled = true;
}

function enableModelControls() {
    trainButton.textContent = 'Train';
    testButton.disabled = false;
    deleteStoredModelButton.disabled = false;
}

async function updateUIControlState() {
    const modelInfo = await SaveablePolicyNetwork.checkStoredModelStatus();
    console.log("checking model status ");
    if (modelInfo == null) {
        storedModelStatusInput.value = 'No stored model.';
        deleteStoredModelButton.disabled = true;

    } else {
        storedModelStatusInput.value = `Saved@${modelInfo.dateSaved.toISOString()}`;
        deleteStoredModelButton.disabled = false;
        createModelButton.disabled = true;
    }
    // loadModelButton.disabled = policyNet != null;
    createModelButton.disabled = policyNet != null;
    hiddenLayerSizesInput.disabled = policyNet != null;
    trainButton.disabled = policyNet == null;
    testButton.disabled = policyNet == null;
    renderDuringTrainingCheckbox.checked = renderDuringTraining;
}

export async function setUpUI() {

    const tetrisEnv = new TetrisAI();
    console.log("setup ui");
    if (await SaveablePolicyNetwork.checkStoredModelStatus() != null) {
        policyNet = await SaveablePolicyNetwork.loadModel();
        logStatus('Loaded policy network from IndexedDB.');
        hiddenLayerSizesInput.value = policyNet.hiddenLayerSizes();
    }
    await updateUIControlState();

    renderDuringTrainingCheckbox.addEventListener('change', () => {
        renderDuringTraining = renderDuringTrainingCheckbox.checked;
    });

    // uploadModelButton.addEventListener('click', async () => {
    //     const input = document.getElementById('file-input');
    //     if(input.files.length > 0){
    //         let file = input.files[0];
    //         let reader = new FileReader();
    //         reader.onload = function(e){
    //             let result = e.target.result;
    //             try{
    //                 let dbRequest = indexedDb.open('modelDB', 1);
    //                 dbRequest.onupgradeneeded = function(event){
    //                     let db = event.target.result;
    //                     db.createObjectStore('models', {keyPath: 'name'});
    //                 };
    //                 dbRequest.onsuccess = function(event){
    //                     let db = event.target.result;
    //                     let transaction = db.transaction(['models'], 'readwrite');
    //                     let store = transaction.objectStore('models');
    //                     let addRequest = store.add({name:'model', data: result});
    //                     addRequest.onsuccess = function(){
    //                         console.log('Model saved to IndexedDB');
    //                     };
    //                     addRequest.onerror = function(){
    //                         console.log('Error saving model to IndexedDB:', addRequest.error);
    //                     };
    //                 };
    //                 dbRequest.onerror = function(event){
    //                     console.error('Error opening IndexedDB:', event.target.errorCode);
    //                 };
    //             } catch (err){
    //                 console.error('Error saving the model:', err);
    //             }
    //         };
    //         reader.readAsText(file);
    //     }
    // });

    createModelButton.addEventListener('click', async () => {
        try {
            const hiddenLayerSizes =
                hiddenLayerSizesInput.value.trim().split(',').map(v => {
                    const num = Number.parseInt(v.trim());
                    if (!(num > 0)) {
                        throw new Error(
                            `Invalid hidden layer sizes string: ` +
                            `${hiddenLayerSizesInput.value}`);
                    }
                    return num;
                });
            policyNet = new SaveablePolicyNetwork(hiddenLayerSizes);
            console.log('DONE constructing new instance of SaveablePolicyNetwork');
            await updateUIControlState();
        } catch (err) {
            logStatus(`ERROR: ${err.message}`);
        }
    });

    deleteStoredModelButton.addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete the locally-stored model?`)) {
            await policyNet.removeModel();
            policyNet = null;
            await updateUIControlState();
        }
    });

    trainButton.addEventListener('click', async () => {
        if (trainButton.textContent === 'Stop') {
            stopRequested = true;
        } else {
            disableModelControls();

            try {
                const trainIterations = Number.parseInt(numIterationsInput.value);
                if (!(trainIterations > 0)) {
                    throw new Error(`Invalid number of iterations: ${trainIterations}`);
                }
                const gamesPerIteration = Number.parseInt(gamesPerIterationInput.value);
                if (!(gamesPerIteration > 0)) {
                    throw new Error(
                        `Invalid # of games per iterations: ${gamesPerIteration}`);
                }
                const maxStepsPerGame = Number.parseInt(maxStepsPerGameInput.value);
                if (!(maxStepsPerGame > 1)) {
                    throw new Error(`Invalid max. steps per game: ${maxStepsPerGame}`);
                }
                const discountRate = Number.parseFloat(discountRateInput.value);
                if (!(discountRate > 0 && discountRate < 1)) {
                    throw new Error(`Invalid discount rate: ${discountRate}`);
                }
                const learningRate = Number.parseFloat(learningRateInput.value);

                logStatus(
                    'Training policy network... Please wait. ' +
                    'Network is saved to IndexedDB at the end of each iteration.');
                const optimizer = tf.train.adam(learningRate);

                meanStepValues = [];
                onIterationEnd(0, trainIterations);
                let t0 = new Date().getTime();
                stopRequested = false;
                for (let i = 0; i < trainIterations; ++i) {
                    tf.env().set("WEBGL_DELETE_TEXTURE_THRESHOLD", 4000000000);
                    const gameSteps = await policyNet.train(
                        tetrisEnv, optimizer, discountRate, gamesPerIteration,
                        maxStepsPerGame);
                    const t1 = new Date().getTime();
                    const stepsPerSecond = sum(gameSteps) / ((t1 - t0) / 1e3);
                    t0 = t1;
                    trainSpeed.textContent = `${stepsPerSecond.toFixed(1)} steps/s`
                    meanStepValues.push({ x: i + 1, y: mean(gameSteps) });
                    console.log(`# of tensors: ${tf.memory().numTensors}`);
                    console.log(`numBytesInGPUAllocated: ${tf.memory().numBytesInGPUAllocated}`);
                    plotSteps();
                    onIterationEnd(i + 1, trainIterations);
                    await tf.nextFrame();  // Unblock UI thread.
                    await policyNet.saveModel();
                    await updateUIControlState();

                    if (stopRequested) {
                        logStatus('Training stopped by user.');
                        break;
                    }
                }
                if (!stopRequested) {
                    logStatus('Training completed.');
                }
            } catch (err) {
                logStatus(`ERROR: ${err.message}`);
            }
            enableModelControls();
        }
    });

    testButton.addEventListener('click', async () => {
        disableModelControls();
        let isDone = false;
        const tetrisEnv = new TetrisAI();
        tetrisEnv.init();
        let steps = 0;
        stopRequested = false;
        while (!isDone) {
            steps++;
            tf.tidy(() => {
                const action = policyNet.getActions(tetrisEnv.getStateTensor())[0];
                logStatus(
                    `Test in progress. ` +
                    `Action: ${action === 1 ? '<--' : ' -->'} (Step ${steps})`);
                tetrisEnv.setInput(action);
                tetrisEnv.update();
                isDone = tetrisEnv.getIsDone();
                tetrisRenderer.drawGame(tetrisEnv.getGameState(), tetrisEnv.getGameStats());
            });
            await tf.nextFrame();  // Unblock UI thread.
            if (stopRequested) {
                break;
            }
        }
        if (stopRequested) {
            logStatus(`Test stopped by user after ${steps} step(s).`);
        } else {
            logStatus(`Test finished. Survived ${steps} step(s).`);
        }
        console.log(`# of tensors: ${tf.memory().numTensors}`);
        enableModelControls();
    });
}