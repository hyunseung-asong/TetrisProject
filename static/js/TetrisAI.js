import TetrisBaseGame from "./TetrisBaseGame.js";
import * as AI from "./AIConfig.js";
import * as Constants from "./GameConstants.js"

export default class TetrisAI extends TetrisBaseGame {

    constructor() {
        super();
    }

    getAllBoardStates() {
        // using BFS to go through all possible end positions of current step.

        // TODO:
        // future pieces.
        //  CHECK FOR MORE THAN JUST CURRENT PIECE. CHECK ALL FUTURE PIECES. (IF COMPUTATIONALLY POSSIBLE, THINK ABOUT WHATS LEFT IN BAG TO COMPUTE EVEN FURTHER BEYOND)

        const [allBoards, allInstructions] = this.bfs(this.board, this.currPiece);

        let boardsToString = [];
        let allBoardsPruned = [];
        let instructionsPruned = [];
        for (let i = 0; i < allBoards.length; i++) {
            const strRepOfBoard = allBoards[i].board.toString();
            if (boardsToString.includes(strRepOfBoard)) {
                continue;
            } else {
                allBoardsPruned.push(allBoards[i]);
                instructionsPruned.push(allInstructions[i]);
                boardsToString.push(strRepOfBoard);

                // console.log(allBoards[i].toString());
                // console.log(allInstructions[i]);
            }
        }
        return [allBoardsPruned, instructionsPruned];
    }

    bfs(board, start) {
        let tempHoldAvailable = this.holdAvailable;
        let queue = [];
        let allBoards = [];
        let allInstructions = [];
        let visited = [];
        queue.push([start, []]); // queue will be in format of [piece, [instructions]]
        while (queue.length > 0) {
            const [piece, currentInstructions] = queue.shift();
            const stringRep = `${piece.shape}, ${piece.x}, ${piece.y}, ${piece.rotation}`;
            if (visited.includes(stringRep)) {
                continue;
            } else {
                visited.push(stringRep);
            }
            if (currentInstructions[currentInstructions.length - 1] == "Harddrop") {
                // Harddrop should always be last instruction
                continue;
            }

            // harddrop will always be an option
            let i;
            for (i = 0; i < Constants.BOARD_HEIGHT - 1; i++) {
                if (!board.isValidPosition(piece, 0, i + 1)) {
                    break;
                }
            }
            const nextInstructions = currentInstructions.slice();
            nextInstructions.push("Harddrop");
            const tempPiece = piece.getDeepCopy();
            tempPiece.move(0, i);
            queue.push([tempPiece, nextInstructions]);

            const newBoard = board.getDeepCopy();
            newBoard.addPiece(tempPiece);
            allBoards.push(newBoard);
            allInstructions.push(nextInstructions);

            if (currentInstructions[currentInstructions.length - 1] != "Move Right") {
                if (board.isValidPosition(piece, -1, 0)) {
                    const nextInstructions = currentInstructions.slice();
                    nextInstructions.push("Move Left");
                    const tempPiece = piece.getDeepCopy();
                    tempPiece.move(-1, 0);
                    queue.push([tempPiece, nextInstructions]);
                }
            }
            if (currentInstructions[currentInstructions.length - 1] != "Move Left") {
                if (board.isValidPosition(piece, 1, 0)) {
                    const nextInstructions = currentInstructions.slice();
                    nextInstructions.push("Move Right");
                    const tempPiece = piece.getDeepCopy();
                    tempPiece.move(1, 0);
                    queue.push([tempPiece, nextInstructions]);
                }
            }
            if (currentInstructions[currentInstructions.length - 1] != "Rotate CCW") {
                if (board.isValidRotation(piece, 1)) {
                    const nextInstructions = currentInstructions.slice();
                    nextInstructions.push("Rotate CW");
                    const tempPiece = piece.getDeepCopy();
                    tempPiece.rotate(board, 1);
                    queue.push([tempPiece, nextInstructions]);
                }
            }
            if (currentInstructions[currentInstructions.length - 1] != "Rotate CW") {
                if (board.isValidRotation(piece, -1)) {
                    const nextInstructions = currentInstructions.slice();
                    nextInstructions.push("Rotate CCW");
                    const tempPiece = piece.getDeepCopy();
                    tempPiece.rotate(board, -1);
                    queue.push([tempPiece, nextInstructions])
                }
            }
            if (tempHoldAvailable) {
                const nextInstructions = currentInstructions.slice();
                nextInstructions.push("Hold");
                if (this.heldPiece == null) {
                    const tempPiece = this.queue.nextPieces[0].getDeepCopy();
                    queue.push([tempPiece, nextInstructions]);
                } else {
                    const tempPiece = this.heldPiece.getDeepCopy();
                    queue.push([tempPiece, nextInstructions]);
                }
                tempHoldAvailable = false;
            }

            if (board.isValidPosition(piece, 0, 1)) {
                const nextInstructions = currentInstructions.slice();
                nextInstructions.push("Softdrop");
                const tempPiece = piece.getDeepCopy();
                tempPiece.move(0, 1);
                queue.push([tempPiece, nextInstructions]);
            }


        }
        return [allBoards, allInstructions]
    }

    getBestBoardState(allBoardStates, listOfInstructions) {
        // board state is "good" if 
        // low high difference (sum of differences of heights is low)
        // low number of holes (check if empty space underneath filled space)
        // low aggregate height (each column's height added up)
        // can score high with cleared lines // should be heavily weighted
        let bestInstructions = [];
        let bestBoardState = allBoardStates[0];
        let bestBoardWeightedScore = -Infinity;
        for (let i = 0; i < allBoardStates.length; i++) {
            const bumpiness = allBoardStates[i].calculateBumpiness();
            const numHoles = allBoardStates[i].calculateNumHoles();
            const aggHeight = allBoardStates[i].calculateAggregateHeight();
            const numCompleteLines = allBoardStates[i].calculateNumCompleteLines();
            const score = this.updateScore(numCompleteLines, allBoardStates[i].board);
            const weightedScore = (AI.BUMPINESS_WEIGHT * bumpiness) + (AI.HOLES_WEIGHT * numHoles) + (AI.HEIGHT_WEIGHT * aggHeight) + (AI.SCORE_WEIGHT * score);
            // WE SHOULD USE GENETIC ALGORITHM TO CALCULATE THIS VALUE FOR OUR OWN PROGRAM

            if (weightedScore > bestBoardWeightedScore) {
                bestBoardWeightedScore = weightedScore;
                bestBoardState = allBoardStates[i];
                bestInstructions = listOfInstructions[i];
            }
        }
        return [bestBoardState, bestInstructions];
    }



    // setInput(input) {
    //     switch (input) {
    //         case 0:
    //             this.inputs["MoveLeft"] = true;
    //             break;
    //         case 1:
    //             this.inputs["MoveRight"] = true;
    //             break;
    //         case 2:
    //             this.inputs["Softdrop"] = true;
    //             break;
    //         case 3:
    //             this.inputs["RotateCCW"] = true;
    //             break;
    //         case 4:
    //             this.inputs["RotateCW"] = true;
    //             break;
    //         case 5:
    //             this.inputs["Hold"] = true;
    //             break;
    //         default:
    //             break;
    //     }
    // }

    flattenBoardTo01s(board) {
        let temp = [];
        for (let row = 0; row < board.board.length; row++) {
            for (let col = 0; col < board.board[row].length; col++) {
                if (board.board[row][col] == 0) {
                    temp.push(false);
                } else {
                    temp.push(true);
                }
            }
        }
        return temp;
    }

    getPieceIn1DArray(piece) {
        let temp = [];
        for (let i = 0; i < piece.positions.length; i++) {
            temp.push(piece.positions[i][0]);
            temp.push(piece.positions[i][1]);
        }
        return temp;
    }

    getStateTensor() {
        let shapeVector = [];
        let flatboard = this.flattenBoardTo01s(this.board);
        shapeVector = shapeVector.concat(flatboard);
        if (this.currPiece != null) {
            let currPieceVector = this.getPieceIn1DArray(this.currPiece);
            shapeVector = shapeVector.concat(currPieceVector);
        } else {
            shapeVector = shapeVector.concat([-1, -1, -1, -1, -1, -1, -1, -1]);
        }
        if (this.heldPiece != null) {
            let heldPieceVector = this.getPieceIn1DArray(this.heldPiece);
            shapeVector = shapeVector.concat(heldPieceVector);
        } else {
            shapeVector = shapeVector.concat([-1, -1, -1, -1, -1, -1, -1, -1]);
        }
        for (let i = 0; i < this.queue.queue.length; i++) {
            let queuePieceVector = this.getPieceIn1DArray(this.queue.queue[i]);
            shapeVector = shapeVector.concat(queuePieceVector);
        }
        return tf.tensor2d([shapeVector]);
    }

    // down should give points
    // extra movement should give negative points?
    // clearing lines should give mega reward
    // keep track of number of rotations/movements before piece placed. continuously give more and more negative reward if this keeps increasing
    // staying alive longer = better
    // extra finess = extra bad
    // clear lines = extra good
    // see how to load models
    // learn to run multiple instances at once
    // see if i can use gpu?

    getReward() {
        let reward = 0;
        if ((this.currMove == "MoveLeft" && this.prevMove == "MoveRight") ||
            (this.currMove == "MoveRight" && this.prevMove == "MoveLeft") ||
            (this.currMove == "RotateCCW" && this.prevMove == "RotateCW") ||
            (this.currMove == "RotateCW" && this.prevMove == "RotateCCW")) {
            // console.log("in");
            reward -= AI.EXTRANEOUS_ACTION_COST;
        }
        reward += this.tempScore;
        reward += this.numPiecesPlaced;
        reward += this.totalLinesCleared;
        reward -= this.stepsBeforePiecePlaced;
        console.log(reward);
        return reward;
    }

    getIsDone() {
        return this.gameOver;
    }
}