import TetrisBaseGame from "./TetrisBaseGame.js";
import * as AI from "./AIConfig.js";

export default class TetrisAI extends TetrisBaseGame {

    constructor() {
        super();
    }

    setInput(input) {
        switch (input) {
            case 0:
                this.inputs["MoveLeft"] = true;
                break;
            case 1:
                this.inputs["MoveRight"] = true;
                break;
            case 2:
                this.inputs["Softdrop"] = true;
                break;
            case 3:
                this.inputs["RotateCCW"] = true;
                break;
            case 4:
                this.inputs["RotateCW"] = true;
                break;
            case 5:
                this.inputs["Hold"] = true;
                break;
            default:
                break;
        }
    }

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