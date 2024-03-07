import * as Constants from "./GameConstants.js";
import * as Config from "./Config.js";
import Board from "./Board.js";
import Piece from "./Piece.js";
import PieceQueue from "./PieceQueue.js";

export default class TetrisGame {
    constructor() {
        // Base game variables
        this.board = new Board();
        this.queue = new PieceQueue();
        this.currPiece = this.queue.grabNextPiece();
        this.heldPiece = null;
        this.piecePlaced = false;
        this.holdAvailable = true;
        this.gameOver = false;
        this.paused = false;

        // Movement variables
        this.holdingMoveLeft = false;
        this.holdingMoveRight = false;
        this.holdingSoftdrop = false;
        this.pressedHarddrop = false;
        this.pressedRotateLeft = false;
        this.pressedRotateRight = false;
        this.pressedHold = false;


        // this.initialMoveSideDone = false;
        // this.lastMoveDownTime = Date.now();
        // this.lastFallTime = Date.now();
        // this.lastMoveSideTime = Date.now();
        // this.lastMoveSidePressed = Date.now();

        // Scoring variables
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

        // Drawing variables
        // this.readyGoScreen = true;
        // this.drawReady = false;
        // this.drawGo = false;
        // this.readyScreenTime = Date.now();

        // Timer variables
        this.now = Date.now();
        this.then = Date.now();
        this.delta = 0;
        this.interval = 1000 / Config.FPS;
    }

    start() {
        requestAnimationFrame(() => this.update());
    }

    update() {
        this.now = Date.now();
        this.delta = this.now - this.then;
        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);

            if (!this.gameOver) {
                // if ready go screen
                // countdownreadygo()
                if (!this.paused) {
                    // this.handleInputs();
                    this.updateBoard();
                }
            }
            // this.updateCanvases();
            console.log(this.board.toStringWithPiece(this.currPiece));

        }
        if (!this.gameOver) {
            requestAnimationFrame(() => this.update());
        }
    }

    updateBoard() {
        if (this.downMovementOccurred) {
            updateScore(0, this.board);
            this.downMovementOccurred = false;
            this.downMovementType = "None";
            this.downMovementLines = 0;
        }
        if (this.piecePlaced) {
            if (!this.board.isValidPosition(this.currPiece)) {
                this.gameOver = true;
                console.log("GG");
            } else {
                this.board.addPiece(this.currPiece);
                let boardBeforeClear = structuredClone(this.board);
                let linesCleared = this.board.removeCompleteLines();
                this.updateScore(linesCleared, boardBeforeClear);
                this.totalLinesCleared += linesCleared;
                this.level = Math.floor(this.totalLinesCleared / 10) + 1;
                this.currPiece = this.queue.grabNextPiece();
                this.piecePlaced = false;
                this.holdAvailable = true;
            }
        }
    }

    updateScore(linesCleared, boardBeforeClear) {
        let currClearAction = "None";
        if (this.downMovementType == "Softdrop") {
            this.score += Config.ACTION_SCORE["Softdrop"];
            return;
        } else if (this.downMovementType == "Harddrop") {
            this.score += Config.ACTION_SCORE["Harddrop"] * this.downMovementLines;
        } else {
            if (this.currPiece == "T" && this.rotationBeforeMovementOccurred) {
                const tSpinCalc = board.tSpinInfo(this.currPiece, boardBeforeClear);
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
        let clearOutput = "";
        let tempScore = Config.ACTION_SCORE[currClearAction];
        let difficult = Config.ACTION_DIFFICULTY[currClearAction];
        let b2bChainBreak = Config.ACTION_BACK_TO_BACK_CHAIN_BREAK[currClearAction];

        if (this.backToBack && difficult) {
            clearOutput += "B2B ";
            if (currClearAction == "Tetris PC") {
                tempScore = Config.ACTION_SCORE['B2B Tetris PC'];
            } else if (difficult) {
                tempScore *= 1.5;
            }
        }
        clearOutput += currClearAction;
        if (linesCleared != 0) {
            this.currentCombo += 1;
            if (this.currentCombo > this.maxCombo) {
                this.maxCombo = this.currentCombo;
            }
            if (this.currentCombo > 0) {
                clearOutput += " Combo " + this.currentCombo;
            }
            tempScore += Config.ACTION_SCORE['Combo'] * this.currentCombo;
        } else {
            this.currentCombo = -1;
        }
        tempScore *= this.level;
        this.score += tempScore;

        if (difficult) {
            this.backToBack = true;
        } else if (b2bChainBreak) {
            this.backToBack = false;
        }

        if (clearOutput != "None") {
            console.log(clearOutput);
        }
    }

    handleInputs(inputs = []) {
        inputs.forEach((input) => {
            switch (input) {
                case "MoveLeft":
                    if (!this.paused) {
                        if (this.board.isValidPosition(this.currPiece, -1, 0)) {
                            this.currPiece.move(-1, 0);
                        }
                    }
                    break;
                case "MoveRight":
                    if (!this.paused) {
                        if (this.board.isValidPosition(this.currPiece, 1, 0)) {
                            this.currPiece.move(1, 0);
                        }
                    }
                    break;
                case "Softdrop":
                    if (!this.paused) {
                        if (this.board.isValidPosition(this.currPiece, 0, 1)) {
                            this.currPiece.move(0, 1);
                        }
                    }
                    break;
                case "Harddrop":
                    if (!this.paused) {
                        let i = 1;
                        for (i = 1; i < Constants.BOARD_HEIGHT; i++) {
                            if (!this.board.isValidPosition(this.currPiece, 0, i)) {
                                break;
                            }
                        }
                        this.currPiece.move(0, i - 1);
                        this.piecePlaced = true;
                        // some more additions for scoring
                    }
                    break;
                case "RotateCCW": // Rotate Left
                    if (!this.paused) {
                        this.currPiece.rotate(this.board, -1);
                    }
                    break;
                case "RotateCW": // Rotate Right
                    if (!this.paused) {
                        this.currPiece.rotate(this.board, 1);
                    }
                    break;
                case "Hold":
                    if (!this.paused) {
                        if (this.holdAvailable) {
                            let temp = this.heldPiece;
                            this.heldPiece = new Piece(this.currPiece.shape);
                            if (temp == null) {
                                this.currPiece = this.queue.grabNextPiece();
                            } else {
                                this.currPiece = temp;
                            }
                            this.holdAvailable = false;
                        }
                    }
                    break;
                case "Pause":
                    this.paused = !this.paused;
                    break;
                case "Restart":
                    break;
                default:
                    break;
            }
        });
    }
}