import TetrisBaseGame from "./TetrisBaseGame";
import Renderer from "./Renderer";
import * as Config from "./Config.js";

export default class Tetris {
    constructor(canvas) {
        this.init();
    }

    init() {
        this.running = true;
        this.game = new TetrisBaseGame();
        this.gameState = this.game.getGameState();
        this.gameStats = this.game.getGameStats();
        this.renderer = new Renderer(canvas);
        this.canvas = canvas;

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
        this.goScreen = false;
        this.paused = false;
    }

    start() {
        this.addMouseEventListeners();
        this.addKeyEventListeners();
        requestAnimationFrame(() => this.update());
    }

    update() {
        if (this.running) {
            this.now = Date.now();
            this.delta = this.now - this.then;

            if (this.readyScreen || this.goScreen) {
                this.countDownReadyGo();
                if(this.readyScreen){
                    //draw ready
                }else if(this.goScreen){
                    //draw go
                }
            } else if (this.paused) {
                // draw paused
            } else {
                // draw gameLoop
                if (this.delta > this.interval) {
                    this.then = this.now - (this.delta % this.interval);
                    this.handleHoldingKeys();
                    this.game.update();
                    // updatecanvas
                }
            }

            requestAnimationFrame(() => this.update());
        }
    }

    stop() {
        this.running = false;
    }

    countDownReadyGo(){
        if(this.now - this.readyScreenTime < Config.READY_SCREEN_TIMER){
            readyScreen = true;
        }else if (this.now - this.readyScreenTime < 2 * Config.READY_SCREEN_TIMER){
            this.readyScreen = false;
            this.goScreen = true;
        }else{
            this.readyScreen = false;
            this.goScreen = false;
        }
    }

    handleHoldingKeys() {
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
        if(this.holdingSoftdrop){
            if(this.now - this.lastMoveDownTime > Config.MOVE_DOWN_FREQ){
                this.game.setInput("Softdrop");
                this.lastMoveDownTime = this.now;
                this.lastFallTime = this.now;
            }
        }
        if(this.pressedHarddrop){
            this.game.setInput("Harddrop");
            this.pressedHarddrop = false;
        }
        if(this.pressedRotateCCW){
            this.game.setInput("RotateCCW");
            this.pressedRotateCCW = false;
        }
        if(this.pressedRotateCW){
            this.game.setInput("RotateCW");
            this.pressedRotateCW = false;
        }
        // natural fall
        if(this.now - this.lastFallTime > Config.FALL_FREQ){
            this.game.natualFall();
            this.lastFallTime = this.now;
        }
    }

    addMouseEventListeners() {
        this.canvas.focus();
        this.canvas.addEventListener("click", () => {
            this.canvas.focus();
            console.log("clicked");
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
                            default:
                                break;
                        }
                    }
                    if (e.key == Config.KEYBINDS['Pause']) {
                        this.paused = !this.paused;
                    } else if (e.key == Config.KEYBINDS['Restart']) {
                        this.init();
                        this.start();
                    }
                }
            }
        });
    }
}