import TetrisAI from "./TetrisAI.js";

export default class Environment {
    constructor() {
        this.tetrisai = new TetrisAI();

    }

    // returns the board, current piece, held piece, next pieces.
    getState() {
        const board = this.tetrisai.board.board;
        const currPiece = this.tetrisai.currPiece.positions;
        currPiece.push([-1, -1]);
        let heldPiece = [[-1, -1], [-1, -1], [-1, -1], [-1, -1]];
        if (this.tetrisai.heldPiece != null) {
            heldPiece = this.tetrisai.heldPiece.positions;
        }
        heldPiece.push([-1, -1]);
        const nextPieces = this.tetrisai.queue.getAllPositions();
        const pieces = [];
        pieces.push(currPiece);
        pieces.push(heldPiece);
        for (let i = 0; i < nextPieces.length; i++) {
            nextPieces[i].push([-1, -1]);
            pieces.push(nextPieces[i]);
        }

        const state = [];
        for(let i = 0; i < pieces.length; i++){
            state.push(tf.util.flatten(pieces[i]));
        }
        for(let i = 0; i < board.length; i++){
            state.push(board[i]);
        }
        
        console.log(state);
        const tens = tf.tensor2d(state, [31, 10]);
        tens.print(true);
        return tens;
    }

    // returns the positive/zero/negative reward for the action that was taken.
    getReward() {

    }

    // takes the action and updates the current state.
    doAction() {

    }

}