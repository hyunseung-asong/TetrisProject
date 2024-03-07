import * as Constants from "./GameConstants.js";


export default class Piece {
    constructor(shape, rotation = 0, x = 3, y = 3) {
        this.shape = shape;
        this.rotation = rotation;
        this.x = x;
        this.y = y;
        this.updatePositions();
        this.tstOrFinKicked = false;
    }

    get getLength() {
        return this.board.length;
    }

    updatePositions() {
        this.positions = [];
        const template = Constants.PIECE_SHAPES[this.shape][this.rotation];
        for (let row = 0; row < template.length; row++) {
            for (let col = 0; col < template[0].length; col++) {
                if (template[row][col] == 1) {
                    this.positions.push([row + this.y, col + this.x]);
                }
            }
        }
    }

    move(adjx = 0, adjy = 0) {
        this.x += adjx;
        this.y += adjy;
        this.updatePositions();
    }


    rotate(board, adjr) {
        if (this.shape == 'O') {
            return;
        }
        const numRotations = Constants.PIECE_SHAPES[this.shape].length;
        const preRotation = this.rotation;
        const postRotation = (((this.rotation + adjr) % numRotations) + numRotations) % numRotations;
        let wallkickTest = -1;
        if (preRotation == 0 && postRotation == 1) {
            wallkickTest = 0;
        } else if (preRotation == 1 && postRotation == 0) {
            wallkickTest = 1;
        } else if (preRotation == 1 && postRotation == 2) {
            wallkickTest = 2;
        } else if (preRotation == 2 && postRotation == 1) {
            wallkickTest = 3;
        } else if (preRotation == 2 && postRotation == 3) {
            wallkickTest = 4;
        } else if (preRotation == 3 && postRotation == 2) {
            wallkickTest = 5;
        } else if (preRotation == 3 && postRotation == 0) {
            wallkickTest = 6;
        } else if (preRotation == 0 && postRotation == 3) {
            wallkickTest = 7;
        }
        for (let i = 0; i < Constants.WALLKICK_JLSTZ[i].length; i++) {
            this.rotation = postRotation;
            this.updatePositions();
            let testx = Constants.WALLKICK_JLSTZ[wallkickTest][i][0];
            let testy = -Constants.WALLKICK_JLSTZ[wallkickTest][i][1];
            console.log(testx + ", " + testy);
            if (this.piece == 'I') {
                testx = Constants.WALLKICK_I[wallkickTest][i][0];
                testy = -Constants.WALLKICK_I[wallkickTest][i][1];
            }
            console.log(this);
            if (board.isValidPosition(this, testx, testy)) {
                this.move(testx, testy);
                this.updatePositions();
                if (this.shape == 'T' &&
                    (wallkickTest == 0 || wallkickTest == 3 || wallkickTest == 4 || wallkickTest == 7) &&
                    i == 4) {
                    this.tstOrFinKicked = true;
                } else {
                    this.tstOrFinKicked = false;
                }

                break;
            } else {
                this.rotation = preRotation;
                this.updatePositions();
            }
        }
    }


}