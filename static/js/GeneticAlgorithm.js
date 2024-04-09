import * as Constants from "./AIConfig.js";

// https://github.com/Tanish0019/Genetic-Algorithm-Flappy-Bird-Using-TensorFlowJS/blob/master/geneticAlgorithm.js

function resetGame() {
    
}

function createNextGeneration() {
    resetGame();
    normalizeFitness(allAgents);
    aliveAgents = generate(allAgents);
    allAgents = aliveAgents.slice();
}

function generate(oldAgents) {
    let newAgents = [];
    for (let i = 0; i < oldAgents.length; i++) {
        let agent = poolSelection(oldAgents);
        newAgents[i] = agent;
    }
    return newAgents;
}

function normalizeFitness(agents) {
    agents.sort((a, b) => a.score - b.score);
    let minScore = agents[0].score;
    let maxScore = agents[agents.length - 1].score;
    for (let i = 0; i < agents.length; i++) {
        agents[i].fitness = (agents[i].score - minScore) / (maxScore - minScore);
    }
}

// select top 5?
function poolSelection(agents) {
    // sort agents by fitness
    agents.sort((a, b) => a.fitness - b.fitness);
    const eliteAgent = agents.pop().copy();
    const topAgents = [];
    while (topAgents.length < Constants.NUM_TOP_AGENTS && agents.length > 0){
        const agent = agents.pop();
        agent.brain.mutate();
        topAgents.push(agent.copy());
    }
    return [eliteAgent, ...topAgents];
}

// keep top x fitness agents
// keep top 1 fitness agent
// add random gaussian to rest of top x
