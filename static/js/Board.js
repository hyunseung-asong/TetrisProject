import * as Constants from "./GameConstants.js";

const BLANK = 0;

export default class Board {
    constructor() {
        this.board = [];
        for (let row = 0; row < Constants.BOARD_HEIGHT; row++) {
            let r = [];
            for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
                r.push(BLANK);
            }
            this.board.push(r);
        }
    }

    calculateNumCompleteLines() {
        let numCompleteLines = 0;
        for (let row = 0; row < Constants.BOARD_HEIGHT; row++) {
            if (this.isCompleteLine(row)) {
                numCompleteLines += 1;
            }
        }
        return numCompleteLines;
    }

    calculateAggregateHeight() {
        let aggHeight = 0;
        for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
            for (let row = 0; row < Constants.BOARD_HEIGHT; row++) {
                if (!this.isBlank(row, col)) {
                    aggHeight += Constants.BOARD_HEIGHT - row;
                    break;
                }
            }
        }
        return aggHeight;
    }

    calculateNumHoles() {
        let numHoles = 0;
        for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
            let tempHoles = 0;
            for (let row = Constants.BOARD_HEIGHT - 1; row > 0; row--) {
                if (!this.isBlank(row, col)) {
                    numHoles += tempHoles;
                    tempHoles = 0;
                } else {
                    tempHoles += 1;
                }
            }
        }
        return numHoles;
    }

    calculateBumpiness() {
        let bumpiness = 0;
        let currHeight = 0;
        let prevHeight = 0;
        for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
            currHeight = 0;
            for (let row = 0; row < Constants.BOARD_HEIGHT; row++) {
                if (!this.isBlank(row, col)) {
                    currHeight = Constants.BOARD_HEIGHT - row;
                    break;
                }
            }
            if (col == 0) {
                prevHeight = currHeight;
            } else {
                bumpiness += Math.abs(currHeight - prevHeight);
                prevHeight = currHeight;
            }
        }
        return bumpiness;
    }

    tSpinInfo(piece) {
        if (piece.shape != 'T') {
            return [0, 0];
        }
        let cornersFilled = 0;
        let cornersFacing = 0;
        let corners = [[0, 0], [2, 0], [0, 2], [2, 2]];

        for (let i = 0; i < corners.length; i++) {
            let cornerx = piece.x + corners[i][1];
            let cornery = piece.y + corners[i][0];
            if (-1 <= cornerx <= Constants.BOARD_WIDTH && -1 <= cornery <= Constants.BOARD_HEIGHT) {
                if (cornerx == -1 || cornerx == Constants.BOARD_WIDTH ||
                    cornery == -1 || cornery == Constants.BOARD_HEIGHT) {
                    cornersFilled += 1;
                } else if (this.board[cornery][cornerx] != BLANK) {
                    cornersFilled += 1;
                }
            }
        }

        let checkCorners = { 0: [0, 1], 1: [0, 3], 2: [2, 3], 3: [0, 2] };
        if (piece.y + corners[checkCorners[piece.rotation][0]][1] < Constants.BOARD_HEIGHT &&
            piece.x + corners[checkCorners[piece.rotation][0]][0] < Constants.BOARD_WIDTH) {
            if (!this.isBlank(piece.y + corners[checkCorners[piece.rotation][0]][1], piece.x + corners[checkCorners[piece.rotation][0]][0])) {
                cornersFacing += 1;
            }
        }
        if (piece.y + corners[checkCorners[piece.rotation][1]][1] < Constants.BOARD_HEIGHT &&
            piece.x + corners[checkCorners[piece.rotation][1]][0] < Constants.BOARD_WIDTH) {
            if (!this.isBlank(piece.y + corners[checkCorners[piece.rotation][1]][1], piece.x + corners[checkCorners[piece.rotation][1]][0])) {
                cornersFacing += 1;
            }
        }

        return [cornersFilled, cornersFacing];
    }

    addPiece(piece) {
        for (let i = 0; i < piece.positions.length; i++) {
            const y = piece.positions[i][0];
            const x = piece.positions[i][1];
            this.board[y][x] = piece.shape;
        }
    }

    isValidPosition(piece, adjx = 0, adjy = 0) {
        for (let i = 0; i < piece.positions.length; i++) {
            let posy = piece.positions[i][0];
            let posx = piece.positions[i][1];
            if (!this.withinBoard(posy + adjy, posx + adjx) ||
                !this.isBlank(posy + adjy, posx + adjx)) {
                return false;
            }
        }
        return true;
    }

    isValidRotation(piece, adjr){
        if (piece.shape == 'O') {
            return false;
        }
        const numRotations = Constants.PIECE_SHAPES[piece.shape].length;
        const preRotation = piece.rotation;
        const postRotation = (((piece.rotation + adjr) % numRotations) + numRotations) % numRotations;
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
            piece.rotation = postRotation;
            piece.updatePositions();
            let testx = Constants.WALLKICK_JLSTZ[wallkickTest][i][0];
            let testy = -Constants.WALLKICK_JLSTZ[wallkickTest][i][1];
            if (piece.shape == 'I') {
                testx = Constants.WALLKICK_I[wallkickTest][i][0];
                testy = -Constants.WALLKICK_I[wallkickTest][i][1];
            }
            if (this.isValidPosition(piece, testx, testy)) {
                // this.move(testx, testy);
                // this.updatePositions();
                piece.rotation = preRotation;
                piece.updatePositions();
                return true;
            } else {
                piece.rotation = preRotation;
                piece.updatePositions();
            }
        }
        return false;
    }

    removeCompleteLines() {
        let numRemovedLines = 0;
        let row = Constants.BOARD_HEIGHT - 1;
        while (row >= 0) {
            if (this.isCompleteLine(row)) {
                for (let pullDownRow = row; pullDownRow > 0; pullDownRow--) {
                    for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
                        this.board[pullDownRow][col] = this.board[pullDownRow - 1][col];
                    }
                }
                for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
                    this.board[0][col] = BLANK;
                }
                numRemovedLines += 1;
            } else {
                row -= 1;
            }
        }
        return numRemovedLines;
    }

    isCompleteLine(row) {
        for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
            if (this.board[row][col] == BLANK) {
                return false;
            }
        }
        return true;
    }

    isBlank(row, col) {
        return this.board[row][col] == BLANK;
    }

    withinBoard(row, col) {
        return (0 <= col && col < Constants.BOARD_WIDTH && 0 <= row && row < Constants.BOARD_HEIGHT);
    }

    get empty() {
        for (let row = Constants.BOARD_HEIGHT - 1; row >= 0; row--) {
            for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
                if (this.board[row][col] != BLANK) {
                    return false;
                }
            }
        }
        return true;
    }

    getDeepCopy() {
        const tempBoard = new Board();
        let newBoard = [];
        for (let row = 0; row < Constants.BOARD_HEIGHT; row++) {
            let r = [];
            for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
                r.push(this.board[row][col]);
            }
            newBoard.push(r);
        }
        tempBoard.board = newBoard;
        return tempBoard;
    }


    toStringWithPiece(piece) {
        if (piece == null) {
            return this.toString();
        }
        let str = "";
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[0].length; col++) {
                let inxys = false;
                piece.positions.forEach((position) => {
                    if (position[0] == row && position[1] == col) {
                        inxys = true;
                    }
                });
                if (inxys) {
                    str += piece.shape;
                } else if (this.isBlank(row, col)) {
                    str += '.';
                } else {
                    str += this.board[row][col];
                }
            }
            str += "\n";
        }
        return str;
    }

    toString() {
        let str = "";
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[0].length; col++) {
                if (this.isBlank(row, col)) {
                    str += '.';
                } else {
                    str += this.board[row][col];
                }
            }
            str += "\n";
        }
        return str;
    }

}