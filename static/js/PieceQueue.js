import * as Constants from "./GameConstants.js";
import Piece from "./Piece.js";


export default class PieceQueue {
    constructor() {
        this.refillBag();
        this.queue = [];
        for (let i = 0; i < Constants.NUM_NEXT_PIECES; i++){
            this.queue.push(this.bag.shift());
        }
    }

    // pops and returns next piece in queue.
    grabNextPiece() {
        const piece = this.queue.shift();
        if (this.bag.length == 0) {
            this.refillBag();
        }
        this.queue.push(this.bag.shift());
        return piece;
    }

    get nextPieces(){
        return this.queue;
    }

    // shuffle and refill bag
    refillBag() {
        this.bag = [];
        const shapes = Object.keys(Constants.PIECE_SHAPES);
        const len = shapes.length;
        for (let i = 0; i < len; i++) {
            const r = Math.floor(Math.random() * shapes.length);
            this.bag.push(new Piece(shapes[r]));
            shapes.splice(r, 1);
        }
    }

    getAllPositions(){
        let res = [];
        for (let i = 0; i < this.queue.length; i++){
            res.push(this.queue[i].positions);
        }
        return res;
    }
}