import TetrisBaseGame from "./TetrisBaseGame.js";
import * as AI from "./AIConfig.js";

export default class TetrisAI extends TetrisBaseGame {

    constructor() {
        super();
    }

    getAllBoardStates() {
        // at WORST CASE: dfs search through all possible combinations of moves (left, right, down, rcw, rccw)
        // at better case: use a better alg such as A* using heuristic to optimize finding best approach towards end goals

        // TODO:
        // future pieces, instructions.
        //  CHECK FOR MORE THAN JUST CURRENT PIECE. CHECK ALL FUTURE PIECES. (IF COMPUTATIONALLY POSSIBLE, THINK ABOUT WHATS LEFT IN BAG TO COMPUTE EVEN FURTHER BEYOND)
        //  GET THE LIST OF INSTRUCTIONS NEEDED TO GET TO SAID POSITION

        let allBoards = [];
        let visited = [];
        this.dfs(this.board, this.currPiece, visited, allBoards);
        

        let boardsToString = [];
        let allBoardsPruned = [];
        for (let i = 0; i < allBoards.length; i++) {
            const strRepOfBoard = allBoards[i].board.toString();
            if (boardsToString.includes(strRepOfBoard)) {
                continue;
            } else {
                allBoardsPruned.push(allBoards[i]);
                boardsToString.push(strRepOfBoard);
            }
        }
        return allBoardsPruned;
        // need to prune same board states because some pieces have different rotation but same output.
    }

    dfs(board, piece, visited, allBoards) {
        const stringRep = `${piece.shape}, ${piece.x}, ${piece.y}, ${piece.rotation}`;
        // console.log(stringRep);
        if (visited.includes(stringRep)) {
            return;
        } else {
            visited.push(stringRep);
        }

        // need to see if moving down would place the piece. If it does, then add the piece to copy of board. add that board to all board  states.
        

        if (board.isValidPosition(piece, -1, 0)) { //dfs(move left piece)
            const tempPiece = piece.getDeepCopy();
            tempPiece.move(-1, 0);
            this.dfs(board, tempPiece, visited, allBoards);
        }
        if (board.isValidPosition(piece, 1, 0)) { // dfs(move right piece)
            const tempPiece = piece.getDeepCopy();
            tempPiece.move(1, 0);
            this.dfs(board, tempPiece, visited, allBoards);
        }
        if (board.isValidPosition(piece, 0, 1)) { // dfs(move down piece)
            const tempPiece = piece.getDeepCopy();
            tempPiece.move(0, 1);
            this.dfs(board, tempPiece, visited, allBoards);
        }

        // dfs(rotate piece cw)
        const rotatedCWPiece = piece.getDeepCopy();
        rotatedCWPiece.rotate(board, 1);
        this.dfs(board, rotatedCWPiece, visited, allBoards);

        // dfs(rotate piece ccw)
        const rotatedCCWPiece = piece.getDeepCopy();
        rotatedCCWPiece.rotate(board, -1);
        this.dfs(board, rotatedCCWPiece, visited, allBoards);

        // dfs using hold
        if(this.holdAvailable){
            if(this.heldPiece == null){
                const nextPieceInQueue = this.queue.nextPieces[0].getDeepCopy();
                this.dfs(this.board, nextPieceInQueue, visited, allBoards);
            }else{
                const heldPiece = this.heldPiece.getDeepCopy();
                this.dfs(this.board, heldPiece, visited, allBoards);
            }
        }

        if (!board.isValidPosition(piece, 0, 1)) {
            // piece can be placed here.
            const newBoard = board.getDeepCopy();
            newBoard.addPiece(piece);
            allBoards.push(newBoard);
            // console.log("added new board to all boards");
            return;
        }
    }

    getBestBoardState(allBoardStates) {
        // board state is "good" if 
        // low high difference (sum of differences of heights is low)
        // low number of holes (check if empty space underneath filled space)
        // low aggregate height (each column's height added up)
        // can score high with cleared lines // should be heavily weighted
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
            }
        }
        console.log(bestBoardState.toString());
        console.log(bestBoardWeightedScore);
        return bestBoardState;
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