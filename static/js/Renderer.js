import * as Config from "./Config.js";

// this is where i need to make ONE CANVAS FOR EVERYTHING
// TETRISBASEGAME IS NOT MAED HERE
// listeners will be here.
// functions will take in base game outputs and render them

export default class Renderer{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }

    drawGame(gameState){
        // drawContainers();
        // drawBackground();
        // this.drawBoard(gameState['board']);
        // drawPiece();
        // drawHeldPiece();
        // drawQueue();
        // drawTexts();
        // drawStats();
    }

    drawContainers(){

    }

    drawBackground(){

    }

    drawBoard(){
        
    }   
    
    drawHeldPiece(){

    }

    drawQueue(){

    }

    drawTexts(){

    }

    drawStats(){
        
    }

    drawBox(){

    }
}