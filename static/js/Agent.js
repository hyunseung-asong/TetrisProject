import NeuralNetwork from "./NeuralNetwork.js";

export default class Agent {
    constructor(brain, env) {
        this.env = env;
        this.score = 0;
        this.fitness = 0;

        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
        } else {
            // [31, 10] input, 1 hiddenlayer of 16 size, 1 output layer of 7 size
            this.brain = new NeuralNetwork(296, 16, 7);
        }
    }

    resetEnvironment() {
        this.env.init();
    }

    resetFitness() {
        this.fitness = 0;
    }

    resetScore() {
        this.score = 0;
    }

    copy() {
        return new Agent(this.brain, this.env);
    }

    chooseAction(state) {
        // state input is the [31, 10] tensor
        // this.brain.model.summary()
        // console.log(state);
        // state.print(true);
        let action = this.brain.predict(state);
        // let read = action.dataSync();
        // console.log(read);
        // console.log(action);
        this.doAction(action.indexOf(Math.max(...action)));
    }

    doAction(action) {
        const actionName = this.env.getActions()[action];
        this.env.doAction(actionName);
        // console.log(actionName);
    }

    update() {
        this.score += this.env.getReward();
    }
}