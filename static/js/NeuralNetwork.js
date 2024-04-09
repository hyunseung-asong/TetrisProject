import * as Constants from "./AIConfig.js";

export default class NeuralNetwork {
    constructor(inputs, hiddenUnits, outputs, model = {}) {
        this.inputNodes = inputs;
        this.hiddenNodes = hiddenUnits;
        this.outputNodes = outputs;
        if (model instanceof tf.Sequential) {
            this.model = model;
        } else {
            this.model = this.createModel();
        }
    }

    createModel() { // probably need more layers
        const model = tf.sequential();
        const hiddenLayer = tf.layers.dense({
            units: this.hiddenNodes,
            inputShape: this.inputNodes,
            activation: "relu"
        });
        model.add(hiddenLayer);

        const outputLayer = tf.layers.dense({
            units: this.outputNodes,
            activation: "softmax"
        });
        model.add(outputLayer);
        return model;
    }

    copy() {
        return tf.tidy(() => {
            const modelCopy = this.createModel();
            const weights = this.model.getWeights();
            const weightCopies = [];
            for (let i = 0; i < weights.length; i++) {
                weightCopies[i] = weights[i].clone();
            }
            return new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes, modelCopy);
        });
    }

    mutate() {
        tf.tidy(() => {
            const weights = this.model.getWeights();
            const mutatedWeights = [];
            for (let i = 0; i < weights.length; i++) {
                let tensor = weights[i];
                let shape = weights[i].shape;
                let values = tensor.dataSync.slice();
                for (let j = 0; j < values.length; j++) {
                    let w = values[j];
                    values[j] = w + Constants.MUTATION_POWER * gaussianRandom();

                }
                let newTensor = tf.tensor(values, shape);
                mutatedWeights[i] = newTensor;
            }
            this.model.setWeights(mutatedWeights);
        });
    }

    predict(state) {
        return tf.tidy(() => {
            const prediction = this.model.predict(state); // chooses 1 of 7 actions
            const output = prediction.dataSync();
            return output;
        });
    }

    dispose() {
        this.model.dispose();
    }
}

function gaussianRandom(mean = 0, stdev = 1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}