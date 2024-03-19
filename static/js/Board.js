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

    calculateNumHoles(){
        let numHoles = 0;
        for(let col = 0; col < Constants.BOARD_WIDTH; col++){
            for(let row = Constants.BOARD_HEIGHT - 1; row > 0; row--){
                if(this.isBlank(row, col) && !this.isBlank(row - 1, col)){
                    numHoles += 1;
                    // should also check if holes are connected. 2 tall hole should count as 2????
                }
            }
        }
        return numHoles;
    }

    calculateBumpiness(){
        let bumpiness = 0;
        let heights = [];
        for(let col = 0; col < Constants.BOARD_WIDTH; col++){
            for(let row = 0; row < Constants.BOARD_HEIGHT; row++){
                if(!this.isBlank(row, col)){
                    heights.push(row);
                    break;
                }
            }
        }
        for(let i = 0; i < heights.length - 1; i++){
            bumpiness += Math.abs(heights[i] - heights[i + 1]);
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
        for(let i = 0; i < piece.positions.length; i++){
            const y = piece.positions[i][0];
            const x = piece.positions[i][1];
            this.board[y][x] = piece.shape;
        }
    }

    isValidPosition(piece, adjx=0, adjy=0) {
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

    getDeepCopy(){
        const tempBoard = new Board();
        let newBoard = [];
        for(let row = 0; row < Constants.BOARD_HEIGHT; row++){
            let r = [];
            for(let col = 0 ; col < Constants.BOARD_WIDTH; col++){
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