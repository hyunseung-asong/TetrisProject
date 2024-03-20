
import { maybeRenderDuringTraining, onGameEnd, setUpUI } from './AITrainer.js';
import * as AI from "./AIConfig.js";

const inputShape = 296;

class PolicyNetwork {
    constructor(hiddenLayerSizesOrModel) {
        if (hiddenLayerSizesOrModel instanceof tf.LayersModel) {
            this.policyNet = hiddenLayerSizesOrModel;
        } else {
            this.createPolicyNetwork(hiddenLayerSizesOrModel);
        }
    }

    createPolicyNetwork(hiddenLayerSizes) {
        if (!Array.isArray(hiddenLayerSizes)) {
            hiddenLayerSizes = [hiddenLayerSizes];
        }
        this.policyNet = tf.sequential();
        hiddenLayerSizes.forEach((hiddenLayerSize, i) => {
            this.policyNet.add(tf.layers.dense({
                units: hiddenLayerSize,
                activation: 'softmax',
                // `inputShape` is required only for the first layer.
                inputShape: i === 0 ? [inputShape] : undefined
            }));
        });
        // The last layer has only one unit. The single output number will be
        // converted to a probability of selecting the leftward-force action.
        this.policyNet.add(tf.layers.dense({ units: AI.NUM_INPUTS }));
    }

    async train(tetrisEnv, optimizer, discountRate, numGames, maxStepsPerGame) {
        const allGradients = [];
        const allRewards = [];
        const gameSteps = [];
        onGameEnd(0, numGames);
        for (let i = 0; i < numGames; ++i) {
            // tetrisEnv.setRandomState();
            tetrisEnv.init();
            const gameRewards = [];
            const gameGradients = [];
            for (let j = 0; j < maxStepsPerGame; ++j) {
                // For every step of the game, remember gradients of the policy
                // network's weights with respect to the probability of the action
                // choice that lead to the reward.
                const allBoardEndStates = tetrisEnv.game.getAllBoardStates();
                const gradients = tf.tidy(() => {
                    const inputTensor = tetrisEnv.getStateTensor();
                    return this.getGradientsAndSaveActions(inputTensor, allBoardEndStates.length).grads;
                });

                this.pushGradients(gameGradients, gradients);
                const action = this.currentActions_[0]; // action is the board's "best" [end state, instructions] 
                // action[0] is the "best" board state
                // action[1] should be the instructions to get to said state.
                // tetrisEnv.setInput(actions[1]);
                // tetrisEnv.update();
                tetrisEnv.executeInstructions(actions[1]);
                const isDone = tetrisEnv.getIsDone();
                const reward = tetrisEnv.getReward();

                await maybeRenderDuringTraining(tetrisEnv);

                if (isDone) {
                    // When the game ends before max step count is reached, a reward of
                    // 0 is given.
                    gameRewards.push(0);
                    break;
                } else {
                    // As long as the game doesn't end, each step leads to a reward of 1.
                    // These reward values will later be "discounted", leading to
                    // higher reward values for longer-lasting games.
                    gameRewards.push(reward);
                }
            }
            onGameEnd(i + 1, numGames);
            gameSteps.push(gameRewards.length);
            this.pushGradients(allGradients, gameGradients);
            allRewards.push(gameRewards);
            await tf.nextFrame();
        }

        tf.tidy(() => {
            // The following line does three things:
            // 1. Performs reward discounting, i.e., make recent rewards count more
            //    than rewards from the further past. The effect is that the reward
            //    values from a game with many steps become larger than the values
            //    from a game with fewer steps.
            // 2. Normalize the rewards, i.e., subtract the global mean value of the
            //    rewards and divide the result by the global standard deviation of
            //    the rewards. Together with step 1, this makes the rewards from
            //    long-lasting games positive and rewards from short-lasting
            //    negative.
            // 3. Scale the gradients with the normalized reward values.
            const normalizedRewards =
                discountAndNormalizeRewards(allRewards, discountRate);
            // Add the scaled gradients to the weights of the policy network. This
            // step makes the policy network more likely to make choices that lead
            // to long-lasting games in the future (i.e., the crux of this RL
            // algorithm.)
            optimizer.applyGradients(
                scaleAndAverageGradients(allGradients, normalizedRewards));
        });
        tf.dispose(allGradients);
        return gameSteps;
    }

    getGradientsAndSaveActions(inputTensor, numEndStates) {
        const f = () => tf.tidy(() => {
            const [logits, actions] = this.getLogitsAndActions(inputTensor, numEndStates);
            this.currentActions_ = actions.dataSync();
            const labels =
                tf.sub(1, tf.tensor2d(this.currentActions_, actions.shape));
            return tf.losses.softmaxCrossEntropy(labels, logits).asScalar();
        });
        return tf.variableGrads(f);
    }

    getCurrentActions() {
        return this.currentActions_;
    }


    // probably have to change this function's left right actions to tetris actions
    // edit: instead of actions, we will give it end states.
    getLogitsAndActions(inputs, numEndStates) {
        return tf.tidy(() => {
            
            const logits = this.policyNet.predict(inputs); // predicts based on input tensor
            const probs = tf.softmax(logits); // makes it so sum is = 1

            // Get the probability of the leftward action.
            // const leftProb = tf.sigmoid(logits);
            // Probabilites of the left and right actions.
            // const leftRightProbs = tf.concat([leftProb, tf.sub(1, leftProb)], 1);
            // const actions = tf.multinomial(probs, AI.NUM_INPUTS, null, true); 
            
            const actions = tf.multinomial(probs, numEndStates, null, true); // action is which state the board should end at
            return [logits, actions];
        });
    }

    getActions(inputs, numEndStates) {
        return this.getLogitsAndActions(inputs, numEndStates)[1].dataSync();
    }

    pushGradients(record, gradients) {
        for (const key in gradients) {
            if (key in record) {
                record[key].push(gradients[key]);
            } else {
                record[key] = [gradients[key]];
            }
        }
    }
}


const MODEL_SAVE_PATH_ = 'indexeddb://tetris-ai-v1';
export class SaveablePolicyNetwork extends PolicyNetwork {
    constructor(hiddenLayerSizesOrModel) {
        super(hiddenLayerSizesOrModel);
    }

    async saveModel() {
        return await this.policyNet.save(MODEL_SAVE_PATH_);
    }

    static async loadModel() {
        const modelsInfo = await tf.io.listModels();
        if (MODEL_SAVE_PATH_ in modelsInfo) {
            console.log(`Loading existing model...`);
            const model = await tf.loadLayersModel(MODEL_SAVE_PATH_);
            console.log(`Loaded model from ${MODEL_SAVE_PATH_}`);
            return new SaveablePolicyNetwork(model);
        } else {
            throw new Error(`Cannot find model at ${MODEL_SAVE_PATH_}.`);
        }
    }

    static async checkStoredModelStatus() {
        // const localSavePath = AI.LOCAL_MODEL_SAVE_PATH_;
        // const indexeddbSavePath = AI.INDEXEDDB_MODEL_SAVE_PATH_;
        // fetch(localSavePath)
        //     .then(response => {
        //         // Check if the response is ok (status 200)
        //         if (!response.ok) {
        //             throw new Error(`HTTP error! status: ${response.status}`);
        //         } else {
        //             // You could log the text to see what's being received before it's parsed as JSON
        //             response.text().then(text => {
        //                 console.log("Received text:", text);
        //                 return JSON.parse(text);
        //             })
        //                 .then(jsonData => {
        //                     // Handle the jsonData
        //                     // Your code to use jsonData
        //                     tf.io.browserHTTPRequest(localSavePath).copyModel(
        //                         localSavePath,
        //                         indexeddbSavePath
        //                     ).then(() => console.log('Model copied to IndexedDB'));
        //                 });
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error fetching or parsing the JSON:', error);
        //     });
        const modelsInfo = await tf.io.listModels();
        console.log(modelsInfo);
        return modelsInfo[MODEL_SAVE_PATH_];
    }

    async removeModel() {
        return await tf.io.removeModel(MODEL_SAVE_PATH_);
    }

    hiddenLayerSizes() {
        const sizes = [];
        for (let i = 0; i < this.policyNet.layers.length - 1; ++i) {
            sizes.push(this.policyNet.layers[i].units);
        }
        return sizes.length === 1 ? sizes[0] : sizes;
    }
}

function discountRewards(rewards, discountRate) {
    const discountedBuffer = tf.buffer([rewards.length]);
    let prev = 0;
    for (let i = rewards.length - 1; i >= 0; --i) {
        const current = discountRate * prev + rewards[i];
        discountedBuffer.set(current, i);
        prev = current;
    }
    return discountedBuffer.toTensor();
}

function discountAndNormalizeRewards(rewardSequences, discountRate) {
    return tf.tidy(() => {
        const discounted = [];
        for (const sequence of rewardSequences) {
            discounted.push(discountRewards(sequence, discountRate))
        }
        // Compute the overall mean and stddev.
        const concatenated = tf.concat(discounted);
        const mean = tf.mean(concatenated);
        const std = tf.sqrt(tf.mean(tf.square(concatenated.sub(mean))));
        // Normalize the reward sequences using the mean and std.
        const normalized = discounted.map(rs => rs.sub(mean).div(std));
        return normalized;
    });
}

function scaleAndAverageGradients(allGradients, normalizedRewards) {
    return tf.tidy(() => {
        const gradients = {};
        for (const varName in allGradients) {
            gradients[varName] = tf.tidy(() => {
                // Stack gradients together.
                const varGradients = allGradients[varName].map(
                    varGameGradients => tf.stack(varGameGradients));
                // Expand dimensions of reward tensors to prepare for multiplication
                // with broadcasting.
                const expandedDims = [];
                for (let i = 0; i < varGradients[0].rank - 1; ++i) {
                    expandedDims.push(1);
                }
                const reshapedNormalizedRewards = normalizedRewards.map(
                    rs => rs.reshape(rs.shape.concat(expandedDims)));
                for (let g = 0; g < varGradients.length; ++g) {
                    // This mul() call uses broadcasting.
                    varGradients[g] = varGradients[g].mul(reshapedNormalizedRewards[g]);
                }
                // Concatenate the scaled gradients together, then average them across
                // all the steps of all the games.
                return tf.mean(tf.concat(varGradients, 0), 0);
            });
        }
        return gradients;
    });
}
tf.setBackend('webgl');
tf.ready().then(() => {
    setUpUI();
});