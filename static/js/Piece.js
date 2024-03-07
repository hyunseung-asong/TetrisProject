import * as Config from "./Config.js";
export default class Piece {
    constructor(shape, rotation = 0, x = 3, y = 3, color = Config.PIECE_COLORS[shape]) {
        this.shape = shape;
        this.rotation = rotation;
        this.x = x;
        this.y = y;
        this.color = color;
    }
}