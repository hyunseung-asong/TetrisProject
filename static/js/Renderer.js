import * as Config from "./Config.js";
import * as Constants from "./GameConstants.js";

const
    BOX_SIZE = 10,
    BORDER_SIZE = 2,
    BORDER_COLOR = "#414141",
    MARGIN_SIZE = BOX_SIZE / 2,
    TEXT_HEIGHT = BOX_SIZE + 5,
    TEXT_SPACER = 3,
    TEXT_FONT = "Montserrat-Medium",
    FONT_SIZE_LARGE = BOX_SIZE + 11,
    FONT_SIZE_MEDIUM = BOX_SIZE + 5,
    FONT_SIZE_SMALL = BOX_SIZE - 1,
    FONT_SIZE_SMALLEST = BOX_SIZE - 5,
    FONT_COLOR_YELLOW = 'rgba(238, 238, 0, 1)',
    FONT_COLOR_WHITE = 'rgba(255, 255, 255, 1)',
    FONT_BACKGROUND_COLOR = 'rgba(155, 155, 155, 1)',
    GRID_HIGHLIGHT = 'rgba(30, 30, 30, 1)',
    GRID_SHADOW = 'rgba(18, 18, 18, 1)'
    ;

const
    CANVAS_HOLD_WIDTH = BOX_SIZE * 4 + 1,
    CANVAS_HOLD_HEIGHT = BOX_SIZE * 3 + 1,
    CANVAS_BOARD_WIDTH = BOX_SIZE * Constants.BOARD_WIDTH + 1,
    CANVAS_BOARD_HEIGHT = BOX_SIZE * Config.VISIBLE_BOARD_HEIGHT + 1,
    CANVAS_QUEUE_WIDTH = BOX_SIZE * 4 + 1,
    CANVAS_QUEUE_HEIGHT = Constants.NUM_NEXT_PIECES * BOX_SIZE * 3 + 1,
    CANVAS_HOLDTEXT_WIDTH = CANVAS_HOLD_WIDTH,
    CANVAS_HOLDTEXT_HEIGHT = TEXT_HEIGHT,
    CANVAS_SCORETEXT_WIDTH = CANVAS_BOARD_WIDTH,
    CANVAS_SCORETEXT_HEIGHT = TEXT_HEIGHT,
    CANVAS_QUEUETEXT_WIDTH = CANVAS_QUEUE_WIDTH,
    CANVAS_QUEUETEXT_HEIGHT = TEXT_HEIGHT,
    CANVAS_WIDTH = 6 * BORDER_SIZE + 2 * MARGIN_SIZE + CANVAS_BOARD_WIDTH + CANVAS_HOLD_WIDTH + CANVAS_QUEUE_WIDTH,
    CANVAS_HEIGHT = 2 * BORDER_SIZE + CANVAS_BOARD_HEIGHT + TEXT_HEIGHT + MARGIN_SIZE,
    CANVAS_CLEARTEXT_WIDTH = CANVAS_QUEUE_WIDTH,
    CANVAS_CLEARTEXT_HEIGHT = FONT_SIZE_SMALLEST,
    CANVAS_STATSTEXT_WIDTH = CANVAS_HOLD_WIDTH,
    CANVAS_STATSTEXT_HEIGHT = 9 * TEXT_SPACER + 3 * FONT_SIZE_MEDIUM + 3 * FONT_SIZE_SMALLEST
    ;



export default class Renderer {
    constructor(canvas, boardx, boardy) {
        this.canvas = canvas;
        // this.canvas.width = Math.max(this.canvas.width, (boardx + 1) * CANVAS_WIDTH);
        // this.canvas.height = Math.max(this.canvas.height, (boardy + 1) * CANVAS_HEIGHT);
        this.ctx = this.canvas.getContext("2d");
        this.xoffset = boardx * CANVAS_WIDTH;
        this.yoffset = boardy * CANVAS_HEIGHT;

        // console.log(CANVAS_WIDTH);
        // console.log(CANVAS_HEIGHT);
        // console.log(this.canvas.width);
        // console.log(this.canvas.height);

        this.canvas_holdtext_xoffset = this.xoffset + BORDER_SIZE;
        this.canvas_holdtext_yoffset = this.yoffset + BORDER_SIZE;
        this.canvas_scoretext_xoffset = this.xoffset + 3 * BORDER_SIZE + CANVAS_HOLD_WIDTH + MARGIN_SIZE;
        this.canvas_scoretext_yoffset = this.yoffset + BORDER_SIZE;
        this.canvas_queuetext_xoffset = this.xoffset + 5 * BORDER_SIZE + CANVAS_HOLD_WIDTH + CANVAS_BOARD_WIDTH + 2 * MARGIN_SIZE;
        this.canvas_queuetext_yoffset = this.yoffset + BORDER_SIZE;
        this.canvas_hold_xoffset = this.xoffset + BORDER_SIZE;
        this.canvas_hold_yoffset = this.yoffset + BORDER_SIZE + TEXT_HEIGHT + MARGIN_SIZE;
        this.canvas_board_xoffset = this.xoffset + 3 * BORDER_SIZE + CANVAS_HOLD_WIDTH + MARGIN_SIZE;
        this.canvas_board_yoffset = this.yoffset + BORDER_SIZE + TEXT_HEIGHT + MARGIN_SIZE;
        this.canvas_queue_xoffset = this.xoffset + 5 * BORDER_SIZE + CANVAS_HOLD_WIDTH + CANVAS_BOARD_WIDTH + 2 * MARGIN_SIZE;
        this.canvas_queue_yoffset = this.yoffset + BORDER_SIZE + TEXT_HEIGHT + MARGIN_SIZE;
        this.canvas_cleartext_xoffset = this.xoffset + this.canvas_queue_xoffset;
        this.canvas_cleartext_yoffset = this.yoffset + TEXT_HEIGHT + 2 * MARGIN_SIZE + 2 * BORDER_SIZE + CANVAS_QUEUE_HEIGHT;
        this.canvas_statstext_xoffset = this.xoffset + BORDER_SIZE;
        this.canvas_statstext_yoffset = this.yoffset + 2 * BORDER_SIZE + TEXT_HEIGHT + CANVAS_HOLD_HEIGHT + 3 * MARGIN_SIZE;
    }

    clearAllBoards(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    drawGame(gameState, gameStats) {
        this.eraseAll();
        this.drawContainers();
        this.drawBackground();
        this.drawBoard(gameState['board']);
        this.drawPieceShadow(gameState['board'], gameState['currPiece']);
        this.drawPieceOnBoard(this.canvas_board_xoffset, this.canvas_board_yoffset, gameState['currPiece']);
        this.drawHeldPiece(gameState['heldPiece']);
        this.drawQueue(gameState['queue']);
        this.drawText("HOLD", TEXT_FONT, FONT_SIZE_SMALL, FONT_COLOR_YELLOW,
            this.canvas_holdtext_xoffset + CANVAS_HOLDTEXT_WIDTH / 2, this.canvas_holdtext_yoffset + CANVAS_HOLDTEXT_HEIGHT,
            "center", "bottom");
        this.drawText("QUEUE", TEXT_FONT, FONT_SIZE_SMALL, FONT_COLOR_YELLOW,
            this.canvas_queuetext_xoffset + CANVAS_QUEUETEXT_WIDTH / 2, this.canvas_queuetext_yoffset + CANVAS_QUEUETEXT_HEIGHT,
            "center", "bottom");
        this.drawStats(gameStats);
        this.drawClearOutput(gameStats);
    }

    drawReady() {
        this.drawTextBackground();
        this.drawText("READY", TEXT_FONT, FONT_SIZE_LARGE, FONT_COLOR_YELLOW,
            this.canvas_board_xoffset + Constants.BOARD_WIDTH / 2 * BOX_SIZE, this.canvas_board_yoffset + (Config.VISIBLE_BOARD_HEIGHT / 2 + 0.5) * BOX_SIZE,
            "center", "middle");
    }

    drawGo() {
        this.drawTextBackground();
        this.drawText("GO", TEXT_FONT, FONT_SIZE_LARGE, FONT_COLOR_YELLOW,
            this.canvas_board_xoffset + Constants.BOARD_WIDTH / 2 * BOX_SIZE, this.canvas_board_yoffset + (Config.VISIBLE_BOARD_HEIGHT / 2 + 0.5) * BOX_SIZE,
            "center", "middle");
    }

    drawPaused() {
        this.drawTextBackground();
        this.drawText("PAUSED", TEXT_FONT, FONT_SIZE_LARGE, FONT_COLOR_YELLOW,
            this.canvas_board_xoffset + Constants.BOARD_WIDTH / 2 * BOX_SIZE, this.canvas_board_yoffset + (Config.VISIBLE_BOARD_HEIGHT / 2 + 0.5) * BOX_SIZE,
            "center", "middle");
    }

    drawGameOver() {
        this.drawTextBackground();
        this.drawText("GAME OVER", TEXT_FONT, FONT_SIZE_LARGE, FONT_COLOR_YELLOW,
            this.canvas_board_xoffset + Constants.BOARD_WIDTH / 2 * BOX_SIZE, this.canvas_board_yoffset + (Config.VISIBLE_BOARD_HEIGHT / 2 + 0.5) * BOX_SIZE,
            "center", "middle");
    }

    drawTextBackground() {
        this.ctx.fillStyle = FONT_BACKGROUND_COLOR;
        this.ctx.fillRect(this.canvas_board_xoffset, this.canvas_board_yoffset + (Config.VISIBLE_BOARD_HEIGHT / 2 - 1) * BOX_SIZE, CANVAS_BOARD_WIDTH, 3 * BOX_SIZE + 1);
    }

    drawClearOutput(gameStats) {
        this.ctx.clearRect(this.canvas_cleartext_xoffset, this.canvas_cleartext_yoffset, CANVAS_CLEARTEXT_WIDTH, CANVAS_CLEARTEXT_HEIGHT);
        this.ctx.fillStyle = FONT_COLOR_WHITE;
        this.drawText(gameStats['clearOutput'], TEXT_FONT, FONT_SIZE_SMALLEST, FONT_COLOR_WHITE,
            this.canvas_cleartext_xoffset + CANVAS_CLEARTEXT_WIDTH / 2, this.canvas_cleartext_yoffset,
            "center", "top");
    }

    drawText(text, font, size, color, x, y, align, baseline) {
        this.ctx.font = size + "px" + " " + font;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    drawStats(gameStats) {
        const score = gameStats['score'].toString().padStart(8, "0");
        this.ctx.clearRect(this.canvas_scoretext_xoffset, this.canvas_scoretext_yoffset, CANVAS_SCORETEXT_WIDTH, CANVAS_SCORETEXT_HEIGHT);
        this.ctx.clearRect(this.canvas_statstext_xoffset, this.canvas_statstext_yoffset, CANVAS_STATSTEXT_WIDTH, CANVAS_STATSTEXT_HEIGHT);
        this.drawText("SCORE: ", TEXT_FONT, FONT_SIZE_SMALL, FONT_COLOR_YELLOW,
            this.canvas_scoretext_xoffset, this.canvas_scoretext_yoffset + CANVAS_SCORETEXT_HEIGHT,
            "left", "bottom");
        this.drawText(score, TEXT_FONT, FONT_SIZE_SMALL, FONT_COLOR_YELLOW,
            this.canvas_scoretext_xoffset + CANVAS_SCORETEXT_WIDTH, this.canvas_scoretext_yoffset + CANVAS_SCORETEXT_HEIGHT,
            "right", "bottom");
        const currentCombo = Math.max(0, gameStats['currentCombo']).toString();
        const level = gameStats['level'].toString();
        const linesCleared = gameStats['linesCleared'].toString();

        this.drawText(currentCombo, TEXT_FONT, FONT_SIZE_MEDIUM, FONT_COLOR_WHITE,
            this.canvas_statstext_xoffset + CANVAS_STATSTEXT_WIDTH / 2, this.canvas_statstext_yoffset + 0,
            "center", "top");
        this.drawText("Combo", TEXT_FONT, FONT_SIZE_SMALLEST, FONT_COLOR_WHITE,
            this.canvas_statstext_xoffset + CANVAS_STATSTEXT_WIDTH / 2, this.canvas_statstext_yoffset + 1 * TEXT_SPACER + FONT_SIZE_MEDIUM,
            "center", "top");
        this.drawText(level, TEXT_FONT, FONT_SIZE_MEDIUM, FONT_COLOR_WHITE,
            this.canvas_statstext_xoffset + CANVAS_STATSTEXT_WIDTH / 2, this.canvas_statstext_yoffset + 4 * TEXT_SPACER + FONT_SIZE_MEDIUM + FONT_SIZE_SMALLEST,
            "center", "top");
        this.drawText("Level", TEXT_FONT, FONT_SIZE_SMALLEST, FONT_COLOR_WHITE,
            this.canvas_statstext_xoffset + CANVAS_STATSTEXT_WIDTH / 2, this.canvas_statstext_yoffset + 5 * TEXT_SPACER + 2 * FONT_SIZE_MEDIUM + FONT_SIZE_SMALLEST,
            "center", "top")
        this.drawText(linesCleared, TEXT_FONT, FONT_SIZE_MEDIUM, FONT_COLOR_WHITE,
            this.canvas_statstext_xoffset + CANVAS_STATSTEXT_WIDTH / 2, this.canvas_statstext_yoffset + 8 * TEXT_SPACER + 2 * FONT_SIZE_MEDIUM + 2 * FONT_SIZE_SMALLEST,
            "center", "top");
        this.drawText("Lines Cleared", TEXT_FONT, FONT_SIZE_SMALLEST, FONT_COLOR_WHITE,
            this.canvas_statstext_xoffset + CANVAS_STATSTEXT_WIDTH / 2, this.canvas_statstext_yoffset + 9 * TEXT_SPACER + 3 * FONT_SIZE_MEDIUM + 2 * FONT_SIZE_SMALLEST,
            "center", "top");
    }

    drawContainers() {
        this.ctx.setLineDash([]);
        this.ctx.lineDashOffset = 0;
        this.ctx.strokeStyle = BORDER_COLOR;
        this.ctx.lineWidth = BORDER_SIZE;
        this.ctx.lineCap = "round";
        this.ctx.strokeRect(this.canvas_hold_xoffset - BORDER_SIZE / 2, this.canvas_hold_yoffset - BORDER_SIZE / 2, CANVAS_HOLD_WIDTH + BORDER_SIZE, CANVAS_HOLD_HEIGHT + BORDER_SIZE);
        this.ctx.strokeRect(this.canvas_board_xoffset - BORDER_SIZE / 2, this.canvas_board_yoffset - BORDER_SIZE / 2, CANVAS_BOARD_WIDTH + BORDER_SIZE, CANVAS_BOARD_HEIGHT + BORDER_SIZE);
        this.ctx.strokeRect(this.canvas_queue_xoffset - BORDER_SIZE / 2, this.canvas_queue_yoffset - BORDER_SIZE / 2, CANVAS_QUEUE_WIDTH + BORDER_SIZE, CANVAS_QUEUE_HEIGHT + BORDER_SIZE);
        this.ctx.lineCap = "butt";
    }

    drawBackground() {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = GRID_SHADOW;
        this.ctx.beginPath();
        // Vertical lines
        for (let x = 0; x <= Constants.BOARD_WIDTH; x++) {
            this.ctx.moveTo(this.canvas_board_xoffset + x * BOX_SIZE + 0.5, this.canvas_board_yoffset + 0.5);
            this.ctx.lineTo(this.canvas_board_xoffset + x * BOX_SIZE + 0.5, this.canvas_board_yoffset + CANVAS_BOARD_HEIGHT + 0.5);
        }
        // Horizontal lines
        for (let y = 0; y <= Config.VISIBLE_BOARD_HEIGHT; y++) {
            this.ctx.moveTo(this.canvas_board_xoffset + 0.5, this.canvas_board_yoffset + y * BOX_SIZE + 0.5);
            this.ctx.lineTo(this.canvas_board_xoffset + CANVAS_BOARD_WIDTH + 0.5, this.canvas_board_yoffset + y * BOX_SIZE + 0.5);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([BOX_SIZE * 5 / 12, BOX_SIZE * 7 / 12])
        this.ctx.strokeStyle = GRID_HIGHLIGHT;
        this.ctx.lineDashOffset = BOX_SIZE * 5 / 26;
        this.ctx.stroke();
    }

    eraseAll() {
        this.ctx.clearRect(this.xoffset, this.yoffset, this.xoffset + CANVAS_WIDTH, this.yoffset + CANVAS_HEIGHT);
    }

    drawBoard(board) {
        for (let row = 0; row < Constants.BOARD_HEIGHT - Constants.BOARD_HEIGHT + Config.VISIBLE_BOARD_HEIGHT; row++) {
            for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
                if (!board.isBlank(row + Constants.BOARD_HEIGHT - Config.VISIBLE_BOARD_HEIGHT, col)) {
                    this.drawBox(this.canvas_board_xoffset, this.canvas_board_yoffset, col, row, Config.PIECE_COLORS[board.board[row + Constants.BOARD_HEIGHT - Config.VISIBLE_BOARD_HEIGHT][col]]);
                }
            }
        }
    }

    drawHeldPiece(piece) {
        this.ctx.clearRect(this.canvas_hold_xoffset, this.canvas_hold_yoffset, CANVAS_HOLD_WIDTH, CANVAS_HOLD_HEIGHT);
        if (piece != null) {
            let x = 0.5;
            let y = 0.5;
            if (piece.shape == 'I') {
                x -= 0.5;
                y -= 0.5;
            } else if (piece.shape == 'O') {
                x -= 0.5;
            }
            this.drawPieceOffBoard(this.canvas_hold_xoffset, this.canvas_hold_yoffset, piece, x, y);
        }
    }

    drawQueue(queue = []) {
        this.ctx.clearRect(this.canvas_queue_xoffset, this.canvas_queue_yoffset, CANVAS_QUEUE_WIDTH, CANVAS_QUEUE_HEIGHT);
        for (let i = 0; i < queue.length; i++) {
            let x = 0.5;
            let y = i * 3 + 0.5;
            if (queue[i].shape == 'I') {
                x -= 0.5;
                y -= 0.5;
            } else if (queue[i].shape == 'O') {
                x -= 0.5;
            }
            this.drawPieceOffBoard(this.canvas_queue_xoffset, this.canvas_queue_yoffset, queue[i], x, y);
        }
    }

    drawPieceShadow(board, piece) {
        let s;
        for (s = 1; s < Constants.BOARD_HEIGHT; s++) {
            if (!board.isValidPosition(piece, 0, s)) {
                break;
            }
        }
        for (let i = 0; i < piece.positions.length; i++) {
            let x = piece.positions[i][1];
            let y = piece.positions[i][0] + s - 1 - Constants.BOARD_HEIGHT + Config.VISIBLE_BOARD_HEIGHT;
            if (y >= 0) {
                this.drawBox(this.canvas_board_xoffset, this.canvas_board_yoffset, x, y, Config.SHADOW_COLORS[piece.shape]);
            }
        }
    }

    drawPieceOnBoard(xoffset, yoffset, piece) {
        for (let i = 0; i < piece.positions.length; i++) {
            let x = piece.positions[i][1];
            let y = piece.positions[i][0] - Constants.BOARD_HEIGHT + Config.VISIBLE_BOARD_HEIGHT;
            if (y >= 0) {
                this.drawBox(xoffset, yoffset, x, y, Config.PIECE_COLORS[piece.shape]);
            }
        }
    }

    drawPieceOffBoard(xoffset, yoffset, piece, x, y) {
        for (let i = 0; i < piece.positions.length; i++) {
            this.drawBox(xoffset, yoffset, piece.positions[i][1] - 3 + x, piece.positions[i][0] - 3 + y, Config.PIECE_COLORS[piece.shape]);
        }
    }

    drawBox(xoffset, yoffset, x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(Math.floor(xoffset + x * BOX_SIZE + 1), Math.floor(yoffset + y * BOX_SIZE + 1), BOX_SIZE - 1, BOX_SIZE - 1);
    }

}