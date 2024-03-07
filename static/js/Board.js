import * as Game from './GameConstants.js';


export default class Board {
    constructor() {
        this.board = [];
        for (let yrow = 0; yrow < Game.BOARD_HEIGHT; yrow++) {
            let row = [];
            for (let xcol = 0; xcol < Game.BOARD_WIDTH; xcol++) {
                row.push(Game.BLANK);
            }
            this.board.push(row);
        }
    }

    get boardEmpty() {
        for (let yrow = Game.BOARD_HEIGHT - 1; yrow >= 0; yrow--) {
            for (let xcol = 0; xcol < Game.BOARD_WIDTH; xcol++) {
                if (this.board[yrow][xcol] != Game.BLANK) {
                    return false;
                }
            }
        }
        return true;
    }

    printBoard() {
        let b = ""
        for (let yrow = 0; yrow < this.board.length; yrow++) {
            let row = "";
            for (let xcol = 0; xcol < board[0].length; xcol++) {
                if (this.board[yrow][xcol] == Game.BLANK) {
                    row += '.';
                } else {
                    row += this.board[yrow][xcol];
                }
            }
            b += row + "\n";
        }
        console.log(b);
    }
}