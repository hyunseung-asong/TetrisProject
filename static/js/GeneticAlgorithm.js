import * as Constants from "./AIConfig.js";

// https://github.com/Tanish0019/Genetic-Algorithm-Flappy-Bird-Using-TensorFlowJS/blob/master/geneticAlgorithm.js

function resetGame(allAgents) {
    for (let i = 0; i < allAgents.length; i++) {
        allAgents[i].resetEnvironment();
        allAgents[i].resetFitness();
        allAgents[i].resetScore();
    }
}

export function createNextGeneration(allGames) {
    const allAgents = [];
    for (let i = 0; i < allGames.length; i++) {
        allAgents[i] = allGames[i]['Agent'];
    }
    normalizeFitness(allAgents);
    const newAgents = poolSelection(allAgents);
    resetGame(allAgents);
    // aliveAgents = generate(allAgents);
    for (let i = 0; i < allGames.length; i++) {
        allGames[i]['Agent'] = newAgents[i];
    }
    console.log(newAgents);
    return allGames.slice();
}

// function generate(oldAgents) {
//     let newAgents = [];
//     for (let i = 0; i < oldAgents.length; i++) {
//         let agent = poolSelection(oldAgents); //TODO: poolselection will be a list of agents, need to select 1 agent to copy from
//         // also need to copy brains, but reset environment 
//         newAgents[i] = agent;
//     }
//     return newAgents;
// }

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

    while (topAgents.length < Constants.NUM_TOP_AGENTS && agents.length > 0) {
        const agent = agents.pop();
        topAgents.push(agent.copy());
    }

    const newAgents = [eliteAgent];
    for (let i = 1; i < agents.length; i++) {
        const agent = topAgents[i % Constants.NUM_TOP_AGENTS];
        agent.brain.mutate();
        newAgents.push(agent.copy());
    }

    resetGame(newAgents);
    return newAgents;
}

// keep top x fitness agents
// keep top 1 fitness agent
// add random gaussian to rest of top x
