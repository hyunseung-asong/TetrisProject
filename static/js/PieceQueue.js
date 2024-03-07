import * as Game from "./GameConstants";
import Piece from "./Piece";

export default class PieceQueue {
    constructor() {
        this.refillQueue();
    }

    get getNextPiece() {
        const piece = this.queue.shift;
        if (queue.length == 0) {
            refillQueue();
        }
        return piece;
    }

    // shuffle and refill queue
    refillQueue() {
        this.queue = [];
        const shapes = Object.keys(Game.PIECE_SHAPES);
        for (let shape in shapes) {
            this.queue.push(new Piece(shape));
        }
    }
}