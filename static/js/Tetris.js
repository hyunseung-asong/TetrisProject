import TetrisBaseGame from "./TetrisBaseGame.js";
import TetrisAI from "./TetrisAI.js";
import Renderer from "./Renderer.js";
import * as Config from "./Config.js";

export default class Tetris {
    constructor(canvas) {
        this.canvas = canvas;
        this.init();
        this.addMouseEventListeners();
        this.addKeyEventListeners();
    }

    init() {
        this.running = true;
        // this.game = new TetrisBaseGame();
        this.game = new TetrisAI();
        this.gameState = this.game.getGameState();
        this.gameStats = this.game.getGameStats();
        this.renderer = new Renderer(this.canvas);

        this.now = Date.now();
        this.then = Date.now();
        this.delta = 0;
        this.interval = 1000 / Config.FPS;

        this.holdingMoveLeft = false;
        this.holdingMoveRight = false;
        this.holdingSoftdrop = false;
        this.pressedHarddrop = false;
        this.pressedRotateCCW = false;
        this.pressedRotateCW = false;
        this.pressedHold = false;
        this.initialMoveSideDone = false;
        this.lastMoveSideTime = Date.now();
        this.lastMoveSidePressed = Date.now();
        this.lastMoveDownTime = Date.now();
        this.lastFallTime = Date.now();

        this.restarted = false;
        this.readyScreenTime = Date.now();
        this.readyScreen = true;
        this.readyScreenDrawn = false;
        this.goScreen = false;
        this.goScreenDrawn = false;
        this.paused = false;
        this.pausedDrawn = false;
    }

    start() {
        this.renderer.drawGame(this.gameState, this.gameStats);
        requestAnimationFrame(() => this.update());
    }

    update() {
        if (this.running) {
            this.now = Date.now();
            this.delta = this.now - this.then;

            if (this.readyScreen || this.goScreen) {
                this.countDownReadyGo();
                if (this.readyScreen && !this.readyScreenDrawn) {
                    this.renderer.drawReady();
                    this.readyScreenDrawn = true;
                } else if (this.goScreen && !this.goScreenDrawn) {
                    this.renderer.drawGo();
                    this.goScreenDrawn = true;
                }
            } else if (this.paused) {
                if (!this.pausedDrawn) {
                    this.renderer.drawPaused();
                    this.pausedDrawn = true;
                }
            } else {
                if (!this.gameState['gameOver']) {
                    if (this.delta > this.interval) {
                        this.then = this.now - (this.delta % this.interval);


                        this.handleGameTimer();
                        this.game.update();
                        this.gameState = this.game.getGameState();
                        this.gameStats = this.game.getGameStats();
                        this.renderer.drawGame(this.gameState, this.gameStats);
                    }
                } else {
                    this.renderer.drawGameOver();
                    this.stop();
                }
            }

            requestAnimationFrame(() => this.update());
        }
    }

    stop() {
        this.running = false;
    }

    countDownReadyGo() {
        if (this.now - this.readyScreenTime < Config.READY_SCREEN_TIMER) {
            this.readyScreen = true;
        } else if (this.now - this.readyScreenTime < 2 * Config.READY_SCREEN_TIMER) {
            this.readyScreen = false;
            this.goScreen = true;
        } else {
            this.readyScreen = false;
            this.goScreen = false;
            this.lastFallTime = this.now;
        }
    }

    handleGameTimer() {
        if (this.holdingMoveLeft || this.holdingMoveRight) {
            if (!this.initialMoveSideDone) {
                if (this.holdingMoveLeft) {
                    this.game.setInput("MoveLeft");
                    this.lastMoveSideTime = this.now;
                }
                if (this.holdingMoveRight) {
                    this.game.setInput("MoveRight");
                    this.lastMoveSideTime = this.now;
                }
                this.initialMoveSideDone = true;
                this.lastMoveSidePressed = this.now;
            } else if (this.now - this.lastMoveSidePressed > Config.MOVE_SIDEWAYS_OFFSET && this.now - this.lastMoveSideTime > Config.MOVE_SIDEWAYS_FREQ) {
                if (this.holdingMoveLeft) {
                    this.game.setInput("MoveLeft");
                    this.lastMoveSideTime = this.now;
                }
                if (this.holdingMoveRight) {
                    this.game.setInput("MoveRight");
                    this.lastMoveSideTime = this.now;
                }
            }
        }
        if (this.holdingSoftdrop) {
            if (this.now - this.lastMoveDownTime > Config.MOVE_DOWN_FREQ) {
                this.game.setInput("Softdrop");
                this.lastMoveDownTime = this.now;
                this.lastFallTime = this.now;
            }
        }
        if (this.pressedHarddrop) {
            this.game.setInput("Harddrop");
            this.pressedHarddrop = false;
            this.lastMoveDownTime = this.now;
            this.lastFallTime = this.now;
        }
        if (this.pressedRotateCCW) {
            this.game.setInput("RotateCCW");
            this.pressedRotateCCW = false;
        }
        if (this.pressedRotateCW) {
            this.game.setInput("RotateCW");
            this.pressedRotateCW = false;
        }
        if (this.pressedHold) {
            this.game.setInput("Hold");
            this.pressedHold = false;
        }
        if (this.now - this.lastFallTime > Config.FALL_FREQ) {
            this.game.natualFall();
            this.lastMoveDownTime = this.now;
            this.lastFallTime = this.now;
        }
    }

    addMouseEventListeners() {
        this.canvas.focus();
        this.canvas.addEventListener("click", () => {
            this.canvas.focus();
        });
    }

    addKeyEventListeners() {
        this.canvas.addEventListener("keyup", (e) => {
            if (!e.repeat) {
                switch (e.key) {
                    case Config.KEYBINDS["MoveLeft"]:
                        this.holdingMoveLeft = false;
                        this.lastMoveSidePressed = this.now;
                        this.initialMoveSideDone = false;
                        break;
                    case Config.KEYBINDS["MoveRight"]:
                        this.holdingMoveRight = false;
                        this.lastMoveSidePressed = this.now;
                        this.initialMoveSideDone = false;
                        break;
                    case Config.KEYBINDS["Softdrop"]:
                        this.holdingSoftdrop = false;
                        break;
                    default:
                        break;
                }
            }
        });
        this.canvas.addEventListener("keydown", (e) => {
            if (!e.repeat) {
                if (!(this.readyScreen || this.goScreen)) {
                    if (!this.paused) {
                        switch (e.key) {
                            case Config.KEYBINDS['MoveLeft']:
                                this.lastMoveSidePressed = this.now;
                                this.holdingMoveLeft = true;
                                break;
                            case Config.KEYBINDS['MoveRight']:
                                this.lastMoveSidePressed = this.now;
                                this.holdingMoveRight = true;
                                break;
                            case Config.KEYBINDS['Softdrop']:
                                this.holdingSoftdrop = true;
                                break;
                            case Config.KEYBINDS['Harddrop']:
                                this.pressedHarddrop = true;
                                break;
                            case Config.KEYBINDS['RotateCCW']:
                                this.pressedRotateCCW = true;
                                break;
                            case Config.KEYBINDS['RotateCW']:
                                this.pressedRotateCW = true;
                                break;
                            case Config.KEYBINDS['Hold']:
                                this.pressedHold = true;
                                break;
                            case 't':
                                const allBoardStatesAndInstructions = this.game.getAllBoardStates();
                                const bestBoardStateAndInstructions = this.game.getBestBoardState(allBoardStatesAndInstructions);
                                console.log(bestBoardStateAndInstructions[0].toString());
                                console.log(bestBoardStateAndInstructions[1]);
                                this.executeInstructions(bestBoardStateAndInstructions[1]);
                                // for(let i = 0 ; i < bs.length; i++){
                                //     console.log(bs[i].toString());
                                // }
                                // console.log(this.game.board.calculateBumpiness());
                                // console.log(this.game.board.calculateNumHoles());
                                // console.log(this.game.board.calculateAggregateHeight());

                                break;
                            default:
                                break;
                        }
                    }
                    if (e.key == Config.KEYBINDS['Pause']) {
                        this.paused = !this.paused;
                        this.pausedDrawn = false;
                    } else if (e.key == Config.KEYBINDS['Restart']) {
                        this.init();
                        this.start();
                    }
                }
            }
        });
    }

    async executeInstructions(listOfInstructions) {
        for (let i = 0; i < listOfInstructions.length; i++) {
            this.game.inputs[listOfInstructions[i]] = true;
            this.game.update();
            await delay(this.interval);
        }
    }
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}