import TetrisBaseGame from "./TetrisBaseGame.js";

export default class Environment {


    FINESS_COST = 10;

    constructor() {
        this.tetris = new TetrisBaseGame();
        this.stepsWithoutPlacing = 0;
        this.currAction = "Softdrop";
        
        this.gameState = this.tetris.getGameState();
        this.gameStats = this.tetris.getGameStats();
    }

    // returns the board, current piece, held piece, next pieces. as a 2D [31,10] tensor in the format [[currPiece], [heldPiece], [nextPieces], [board]]
    getState() {
        const board = this.tetris.board.board;
        const currPiece = this.tetris.currPiece.positions;
        currPiece.push([-1, -1]);
        let heldPiece = [[-1, -1], [-1, -1], [-1, -1], [-1, -1]];
        if (this.tetris.heldPiece != null) {
            heldPiece = this.tetris.heldPiece.positions;
        }
        heldPiece.push([-1, -1]);
        const nextPieces = this.tetris.queue.getAllPositions();
        const pieces = [];
        pieces.push(currPiece);
        pieces.push(heldPiece);
        for (let i = 0; i < nextPieces.length; i++) {
            nextPieces[i].push([-1, -1]);
            pieces.push(nextPieces[i]);
        }

        const state = [];
        for (let i = 0; i < pieces.length; i++) {
            state.push(tf.util.flatten(pieces[i]));
        }
        for (let i = 0; i < board.length; i++) {
            state.push(board[i]);
        }

        const tens = tf.tensor(state, [[31, 10]]);
        tens.print(true);
        return tens;
    }

    // returns the positive/zero/negative reward for the action that was taken.
    getReward() {
        reward = 0;
        if (this.tetris.piecePlaced) {
            this.stepsWithoutPlacing = 0;
        } else {
            this.stepsWithoutPlacing += 1;
        }
        reward -= this.stepsWithoutPlacing;
        if (this.currAction == "MoveLeft" && this.prevAction == "MoveRight" || 
            this.currAction == "MoveRight" && this.prevAction == "MoveLeft" || 
            this.currAction == "RotateCCW" && this.prevAction == "RotateCW" ||
            this.currAction == "RotateCW" && this.prevAction == "RotateCCW") {
            reward -= this.FINESS_COST;
        }
        reward += this.tetris.score;

        return reward;
    }

    getActions() {
        return ["MoveLeft", "MoveRight", "Softdrop", "Harddrop", "RotateCCW", "RotateCW", "Hold"];
    }

    // takes the action and updates the current state.
    doAction(action) {
        this.prevAction = this.currAction;
        this.currAction = action;
        this.tetris.setInput(action);
        this.tetris.update();
        this.gameState = this.tetris.getGameState();
        this.gameStats = this.tetris.getGameStats();
    }

    isDone(){
        return this.gameState['gameOver'];
    }
}
