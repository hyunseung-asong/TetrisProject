import TetrisBaseGame from "./TetrisBaseGame.js";

export default class Environment {


    FINESS_COST = 10;

    constructor() {
        this.init();
    }

    init() {
        this.tetris = new TetrisBaseGame();
        this.stepsWithoutPlacing = 0;
        this.currAction = "Softdrop";

        this.gameState = this.tetris.getGameState();
        this.gameStats = this.tetris.getGameStats();
    }

    naturalFall() {
        this.tetris.natualFall();
    }

    // returns the board, current piece, held piece, next pieces. as a 2D [31,10] tensor in the format [[currPiece], [heldPiece], [nextPieces], [board]]
    getState() {
        // console.log(this.gameState);
        // console.log(this.gameStats);
        const board = this.tetris.board.board;
        // console.log(this.tetris.board.toString());
        const currPiece = this.tetris.currPiece.positions;
        // currPiece.push([0, 0]);
        let heldPiece = [[-1, -1], [-1, -1], [-1, -1], [-1, -1]];
        if (this.tetris.heldPiece != null) {
            heldPiece = this.tetris.heldPiece.positions;
        }
        // heldPiece.push([0, 0]);
        const nextPieces = this.tetris.queue.getAllPositions();
        const pieces = [];
        pieces.push(currPiece);
        pieces.push(heldPiece);
        for (let i = 0; i < nextPieces.length; i++) {
            pieces.push(nextPieces[i]);
        }



        let state = [];
        for (let i = 0; i < pieces.length; i++) {
            state.push(tf.util.flatten(pieces[i]));
        }
        for (let i = 0; i < board.length; i++) {
            let temp = [];
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] != 0) {
                    temp.push(1);
                } else {
                    temp.push(0);
                }
            }
            state.push(temp);
        }

        // console.log(state);

        state = tf.util.flatten(state);
        let str = "";
        for (let i = 0; i < state.length; i++) {
            str += state[i] + ", "
        }
        // console.log(str);
        let tens = tf.tensor(state);
        // tens.print(true);
        // console.log("::");
        tens = tens.reshape([1, 296]);
        // tens.print(true);
        return tens;
    }

    // returns the positive/zero/negative reward for the action that was taken.
    getReward() {
        let reward = 0;
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

    isDone() {
        return this.gameState['gameOver'];
    }
}
