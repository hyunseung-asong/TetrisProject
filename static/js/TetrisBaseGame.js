import * as Constants from "./GameConstants.js";
import Board from "./Board.js";
import Piece from "./Piece.js";
import PieceQueue from "./PieceQueue.js";

export default class TetrisBaseGame {
    constructor() {
        // Base game variables
        this.board = new Board();
        this.queue = new PieceQueue();
        this.currPiece = this.queue.grabNextPiece();
        this.heldPiece = null;
        this.piecePlaced = false;
        this.holdAvailable = true;
        this.gameOver = false;
        this.inputs = {
            "MoveLeft": false,
            "MoveRight": false,
            "Softdrop": false,
            "Harddrop": false,
            "RotateCW": false,
            "RotateCCW": false,
            "Hold": false,
            "Restart": false
        };

        // Scoring variables
        this.clearOutput = "";
        this.score = 0;
        this.totalLinesCleared = 0;
        this.level = 1;
        this.currentCombo = -1;
        this.maxCombo = 0;
        this.tstOrFinKick = false;
        this.rotationBeforeMovementOccurred = false;
        this.downMovementOccurred = false;
        this.downMovementType = "None";
        this.downMovementLines = 0;
        this.backToBack = false;

    }

    getGameState() {
        return {
            'board': this.board,
            'currPiece': this.currPiece,
            'heldPiece': this.heldPiece,
            'queue': this.queue.queue,
            'gameOver': this.gameOver
        };
    }

    getGameStats() {
        return {
            'score': this.score,
            'linesCleared': this.totalLinesCleared,
            'level': this.level,
            'currentCombo': this.currentCombo,
            'maxCombo': this.maxCombo,
            'clearOutput': this.clearOutput
        };
    }

    update() {
        if (!this.gameOver) {
            this.handleInputs();
            this.updateBoard();
        }
    }

    updateBoard() {
        if (this.downMovementOccurred) {
            this.updateScore(0, this.board);
            this.downMovementOccurred = false;
            this.downMovementType = "None";
            this.downMovementLines = 0;
        }
        if (this.piecePlaced) {
            if (!this.board.isValidPosition(this.currPiece)) {
                this.gameOver = true;
            } else {
                this.board.addPiece(this.currPiece);
                let boardBeforeClear = new Board();
                boardBeforeClear.board = this.board.getDeepCopy();
                let linesCleared = this.board.removeCompleteLines();
                this.updateScore(linesCleared, boardBeforeClear);
                this.totalLinesCleared += linesCleared;
                this.level = Math.floor(this.totalLinesCleared / 10) + 1;

                let tempNextPiece = this.queue.grabNextPiece();
                if (!this.board.isValidPosition(tempNextPiece)) {
                    tempNextPiece.move(0, -1);
                    if (!this.board.isValidPosition(tempNextPiece)) {
                        this.gameOver = true;
                    }
                }
                this.currPiece = tempNextPiece;
                this.piecePlaced = false;
                this.holdAvailable = true;
            }
        }
    }

    updateScore(linesCleared, boardBeforeClear) {
        let currClearAction = "None";
        if (this.downMovementType == "Softdrop") {
            currClearAction = "Softdrop";
            this.score += Constants.ACTION_SCORE["Softdrop"];
            return;
        } else if (this.downMovementType == "Harddrop") {
            currClearAction = "Harddrop";
            this.score += Constants.ACTION_SCORE["Harddrop"] * this.downMovementLines;
        } else {
            if (this.currPiece.shape == "T" && this.rotationBeforeMovementOccurred) {
                const tSpinCalc = boardBeforeClear.tSpinInfo(this.currPiece, boardBeforeClear);
                const cornersFilled = tSpinCalc[0];
                const cornersFacing = tSpinCalc[1];
                if (cornersFacing == 2 || this.currPiece.tstOrFinKicked) {
                    if (cornersFilled == 3 || cornersFilled == 4) {
                        if (linesCleared == 0) {
                            currClearAction = "T-Spin no lines";
                        } else if (linesCleared == 1) {
                            currClearAction = "T-Spin Single";
                        } else if (linesCleared == 2) {
                            currClearAction = "T-Spin Double";
                        } else if (linesCleared == 3) {
                            currClearAction = "T-Spin Triple";
                        }
                    }
                } else if (cornersFacing == 1) {
                    if (cornersFilled == 3 || cornersFilled == 4) {
                        if (linesCleared == 0) {
                            currClearAction = "Mini T-Spin no lines";
                        } else if (linesCleared == 1) {
                            currClearAction = "Mini T-Spin Single";
                        } else if (linesCleared == 2) {
                            currClearAction = "Mini T-Spin Double";
                        }
                    }
                }
            } else if (currClearAction == "None") { // did not satisfy tspin
                if (linesCleared == 1) {
                    if (this.board.empty) {
                        currClearAction = "Single PC";
                    } else {
                        currClearAction = "Single";
                    }
                } else if (linesCleared == 2) {
                    if (this.board.empty) {
                        currClearAction = "Double PC";
                    } else {
                        currClearAction = "Double";
                    }
                } else if (linesCleared == 3) {
                    if (this.board.empty) {
                        currClearAction = "Triple PC";
                    } else {
                        currClearAction = "Triple";
                    }
                } else if (linesCleared == 4) {
                    if (this.board.empty) {
                        currClearAction = "Tetris PC";
                    } else {
                        currClearAction = "Tetris";
                    }
                }
            }
        }
        this.clearOutput = "";
        let tempScore = Constants.ACTION_SCORE[currClearAction];
        let difficult = Constants.ACTION_DIFFICULTY[currClearAction];
        let b2bChainBreak = Constants.ACTION_BACK_TO_BACK_CHAIN_BREAK[currClearAction];

        if (this.backToBack && difficult) {
            this.clearOutput += "B2B ";
            if (currClearAction == "Tetris PC") {
                tempScore = Constants.ACTION_SCORE['B2B Tetris PC'];
            } else if (difficult) {
                tempScore *= 1.5;
            }
        }
        if (!(currClearAction == "Softdrop" || currClearAction == "Harddrop")) {
            if (currClearAction != "None") {
                this.clearOutput += currClearAction;
            }
            if (linesCleared != 0) {
                this.currentCombo += 1;
                if (this.currentCombo > this.maxCombo) {
                    this.maxCombo = this.currentCombo;
                }
                if (this.currentCombo > 0) {
                    this.clearOutput += " Combo " + this.currentCombo;
                }
                tempScore += Constants.ACTION_SCORE['Combo'] * this.currentCombo;
            } else {
                this.currentCombo = -1;
            }
        }
        tempScore *= this.level;
        this.score += tempScore;

        if (difficult) {
            this.backToBack = true;
        } else if (b2bChainBreak) {
            this.backToBack = false;
        }
    }


    natualFall() {
        if (this.board.isValidPosition(this.currPiece, 0, 1)) {
            this.currPiece.move(0, 1);
            this.rotationBeforeMovementOccurred = false;
            this.downMovementType = "Natural";
            this.downMovementLines = 1;
        } else {
            this.piecePlaced = true;
        }
    }


    setInput(input) {
        this.inputs[input] = true;
    }

    handleInputs() {
        Object.keys(this.inputs).forEach((input) => {

            switch (input) {
                case "MoveLeft":
                    if (this.inputs[input]) {
                        if (this.board.isValidPosition(this.currPiece, -1, 0)) {
                            this.currPiece.move(-1, 0);
                            this.rotationBeforeMovementOccurred = false;
                        }
                    }
                    break;
                case "MoveRight":
                    if (this.inputs[input]) {
                        if (this.board.isValidPosition(this.currPiece, 1, 0)) {
                            this.currPiece.move(1, 0);
                            this.rotationBeforeMovementOccurred = false;
                        }
                    }
                    break;
                case "Softdrop":
                    if (this.inputs[input]) {
                        if (this.board.isValidPosition(this.currPiece, 0, 1)) {
                            this.currPiece.move(0, 1);
                            this.rotationBeforeMovementOccurred = false;
                            this.downMovementOccurred = true;
                            this.downMovementType = "Softdrop";
                            this.downMovementLines = 1;
                        }
                    }
                    break;
                case "Harddrop":
                    if (this.inputs[input]) {
                        let i = 1;
                        for (i = 1; i < Constants.BOARD_HEIGHT; i++) {
                            if (!this.board.isValidPosition(this.currPiece, 0, i)) {
                                break;
                            }
                        }
                        this.currPiece.move(0, i - 1);
                        this.piecePlaced = true;
                        if (i - 1 > 0) {
                            this.rotationBeforeMovementOccurred = false;
                            this.downMovementOccurred = true;
                            this.downMovementType = "Harddrop";
                            this.downMovementLines = i - 1;
                        }
                    }
                    break;
                case "RotateCCW": // Rotate Left
                    if (this.inputs[input]) {
                        this.currPiece.rotate(this.board, -1);
                        this.rotationBeforeMovementOccurred = true;
                        // SHOULD ONLY BE WHEN SUCCESSFUL
                    }
                    break;
                case "RotateCW": // Rotate Right
                    if (this.inputs[input]) {
                        this.currPiece.rotate(this.board, 1);
                        this.rotationBeforeMovementOccurred = true;
                        // SHOULD ONLY BE WHEN SUCCESSFUL
                    }
                    break;
                case "Hold":
                    if (this.inputs[input]) {
                        if (this.holdAvailable) {
                            let temp = this.heldPiece;
                            this.heldPiece = new Piece(this.currPiece.shape);
                            if (temp == null) {
                                let tempNextPiece = this.queue.grabNextPiece();
                                if (!this.board.isValidPosition(tempNextPiece)) {
                                    tempNextPiece.move(0, -1);
                                    if (!this.board.isValidPosition(tempNextPiece)) {
                                        this.gameOver = true;
                                    }
                                }
                                this.currPiece = tempNextPiece;
                            } else {
                                if (!this.board.isValidPosition(temp)) {
                                    temp.move(0, -1);
                                    if (!this.board.isValidPosition(temp)) {
                                        this.gameOver = true;
                                    }
                                }
                                this.currPiece = temp;
                            }
                            this.holdAvailable = false;

                        }
                    }
                    break;
                default:
                    break;
            }
        });
        // all the inputs are handled, set them to false.
        Object.keys(this.inputs).forEach((input) => {
            this.inputs[input] = false;
        });
    }
}