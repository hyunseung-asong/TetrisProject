import * as Config from "./Config.js";
import * as Constants from "./GameConstants.js";
const
    BOX_SIZE = 25,
    BORDER_SIZE = 2,
    BORDER_COLOR = "#414141",
    MARGIN_SIZE = 10,
    TEXT_HEIGHT = 30,
    TEXT_SPACER = 3,

    CANVAS_HOLD_WIDTH = BOX_SIZE * 4 + 1,
    CANVAS_HOLD_HEIGHT = BOX_SIZE * 3 + 1,
    CANVAS_BOARD_WIDTH = BOX_SIZE * Constants.BOARD_WIDTH + 1,
    CANVAS_BOARD_HEIGHT = BOX_SIZE * Config.VISIBLE_BOARD_HEIGHT + 1,
    CANVAS_QUEUE_WIDTH = BOX_SIZE * 4 + 1,
    CANVAS_QUEUE_HEIGHT = Constants.NUM_NEXT_PIECES * BOX_SIZE * 3 + 1,

    CANVAS_HOLDTEXT_XOFFSET = BORDER_SIZE,
    CANVAS_HOLDTEXT_YOFFSET = BORDER_SIZE,
    CANVAS_HOLDTEXT_WIDTH = CANVAS_HOLD_WIDTH,
    CANVAS_HOLDTEXT_HEIGHT = TEXT_HEIGHT,
    CANVAS_SCORETEXT_XOFFSET = 3 * BORDER_SIZE + CANVAS_HOLD_WIDTH + MARGIN_SIZE,
    CANVAS_SCORETEXT_YOFFSET = BORDER_SIZE,
    CANVAS_SCORETEXT_WIDTH = CANVAS_BOARD_WIDTH,
    CANVAS_SCORETEXT_HEIGHT = TEXT_HEIGHT,
    CANVAS_QUEUETEXT_XOFFSET = 5 * BORDER_SIZE + CANVAS_HOLD_WIDTH + CANVAS_BOARD_WIDTH + 2 * MARGIN_SIZE,
    CANVAS_QUEUETEXT_YOFFSET = BORDER_SIZE,
    CANVAS_QUEUETEXT_WIDTH = CANVAS_QUEUE_WIDTH,
    CANVAS_QUEUETEXT_HEIGHT = TEXT_HEIGHT,

    CANVAS_HOLD_XOFFSET = BORDER_SIZE,
    CANVAS_HOLD_YOFFSET = BORDER_SIZE + TEXT_HEIGHT + MARGIN_SIZE,
    CANVAS_BOARD_XOFFSET = 3 * BORDER_SIZE + CANVAS_HOLD_WIDTH + MARGIN_SIZE,
    CANVAS_BOARD_YOFFSET = BORDER_SIZE + TEXT_HEIGHT + MARGIN_SIZE,
    CANVAS_QUEUE_XOFFSET = 5 * BORDER_SIZE + CANVAS_HOLD_WIDTH + CANVAS_BOARD_WIDTH + 2 * MARGIN_SIZE,
    CANVAS_QUEUE_YOFFSET = BORDER_SIZE + TEXT_HEIGHT + MARGIN_SIZE,
    CANVAS_WIDTH = 6 * BORDER_SIZE + 2 * MARGIN_SIZE + CANVAS_BOARD_WIDTH + CANVAS_HOLD_WIDTH + CANVAS_QUEUE_WIDTH,
    CANVAS_HEIGHT = 2 * BORDER_SIZE + CANVAS_BOARD_HEIGHT + TEXT_HEIGHT + MARGIN_SIZE,

    CANVAS_CLEARTEXT_XOFFSET = CANVAS_QUEUE_XOFFSET,
    CANVAS_CLEARTEXT_YOFFSET = TEXT_HEIGHT + 2 * MARGIN_SIZE + 2 * BORDER_SIZE + CANVAS_QUEUE_HEIGHT,
    CANVAS_CLEARTEXT_WIDTH = CANVAS_QUEUE_WIDTH,
    CANVAS_CLEARTEXT_HEIGHT = Config.FONT_SIZE_SMALLEST,

    CANVAS_STATSTEXT_XOFFSET = BORDER_SIZE,
    CANVAS_STATSTEXT_YOFFSET = 2 * BORDER_SIZE + TEXT_HEIGHT + CANVAS_HOLD_HEIGHT + 3 * MARGIN_SIZE,
    CANVAS_STATSTEXT_WIDTH = CANVAS_HOLD_WIDTH,
    CANVAS_STATSTEXT_HEIGHT = 9 * TEXT_SPACER + 3 * Config.FONT_SIZE_MEDIUM + 3 * Config.FONT_SIZE_SMALLEST,

    GRID_HIGHLIGHT = 'rgba(30, 30, 30, 1)',
    GRID_SHADOW = 'rgba(18, 18, 18, 1)'
    ;

export default class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext("2d");
    }

    // drawInitial(gameState, gameStats) {
    //     this.drawContainers();
    //     this.drawBackground();
    //     this.drawPieceShadow(gameState['board'], gameState['currPiece']);
    //     this.drawPieceOnBoard(CANVAS_BOARD_XOFFSET, CANVAS_BOARD_YOFFSET, gameState['currPiece']);
    //     this.drawHeldPiece(gameState['heldPiece']);
    //     this.drawQueue(gameState['queue']);
    //     this.drawText("HOLD", Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW,
    //         CANVAS_HOLDTEXT_XOFFSET + CANVAS_HOLDTEXT_WIDTH / 2, CANVAS_HOLDTEXT_YOFFSET + CANVAS_HOLDTEXT_HEIGHT,
    //         "center", "bottom");
    //     this.drawText("QUEUE", Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW,
    //         CANVAS_QUEUETEXT_XOFFSET + CANVAS_QUEUETEXT_WIDTH / 2, CANVAS_QUEUETEXT_YOFFSET + CANVAS_QUEUETEXT_HEIGHT,
    //         "center", "bottom");
    //     this.drawStats(gameStats);

    // }

    drawGame(gameState, gameStats) {
        this.eraseAll();
        this.drawContainers();
        this.drawBackground();
        this.drawBoard(gameState['board']);
        this.drawPieceShadow(gameState['board'], gameState['currPiece']);
        this.drawPieceOnBoard(CANVAS_BOARD_XOFFSET, CANVAS_BOARD_YOFFSET, gameState['currPiece']);
        this.drawHeldPiece(gameState['heldPiece']);
        this.drawQueue(gameState['queue']);
        this.drawText("HOLD", Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW,
            CANVAS_HOLDTEXT_XOFFSET + CANVAS_HOLDTEXT_WIDTH / 2, CANVAS_HOLDTEXT_YOFFSET + CANVAS_HOLDTEXT_HEIGHT,
            "center", "bottom");
        this.drawText("QUEUE", Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW,
            CANVAS_QUEUETEXT_XOFFSET + CANVAS_QUEUETEXT_WIDTH / 2, CANVAS_QUEUETEXT_YOFFSET + CANVAS_QUEUETEXT_HEIGHT,
            "center", "bottom");
        this.drawStats(gameStats);
        this.drawClearOutput(gameStats);
    }

    drawReady() {
        this.drawTextBackground();
        this.drawText("READY", Config.TEXT_FONT, Config.FONT_SIZE_LARGE, Config.FONT_COLOR_YELLOW,
            CANVAS_BOARD_XOFFSET + Constants.BOARD_WIDTH / 2 * BOX_SIZE, CANVAS_BOARD_YOFFSET + (Config.VISIBLE_BOARD_HEIGHT / 2 + 0.5) * BOX_SIZE,
            "center", "middle");
    }

    drawGo() {
        this.drawTextBackground();
        this.drawText("GO", Config.TEXT_FONT, Config.FONT_SIZE_LARGE, Config.FONT_COLOR_YELLOW,
            CANVAS_BOARD_XOFFSET + Constants.BOARD_WIDTH / 2 * BOX_SIZE, CANVAS_BOARD_YOFFSET + (Config.VISIBLE_BOARD_HEIGHT / 2 + 0.5) * BOX_SIZE,
            "center", "middle");
    }

    drawPaused() {
        this.drawTextBackground();
        this.drawText("PAUSED", Config.TEXT_FONT, Config.FONT_SIZE_LARGE, Config.FONT_COLOR_YELLOW,
            CANVAS_BOARD_XOFFSET + Constants.BOARD_WIDTH / 2 * BOX_SIZE, CANVAS_BOARD_YOFFSET + (Config.VISIBLE_BOARD_HEIGHT / 2 + 0.5) * BOX_SIZE,
            "center", "middle");
    }

    drawGameOver() {
        this.drawTextBackground();
        this.drawText("GAME OVER", Config.TEXT_FONT, Config.FONT_SIZE_LARGE, Config.FONT_COLOR_YELLOW,
            CANVAS_BOARD_XOFFSET + Constants.BOARD_WIDTH / 2 * BOX_SIZE, CANVAS_BOARD_YOFFSET + (Config.VISIBLE_BOARD_HEIGHT / 2 + 0.5) * BOX_SIZE,
            "center", "middle");
    }

    drawTextBackground() {
        this.ctx.fillStyle = Config.FONT_BACKGROUND_COLOR;
        this.ctx.fillRect(CANVAS_BOARD_XOFFSET, CANVAS_BOARD_YOFFSET + (Config.VISIBLE_BOARD_HEIGHT / 2 - 1) * BOX_SIZE, CANVAS_BOARD_WIDTH, 3 * BOX_SIZE + 1);
    }

    drawClearOutput(gameStats) {
        this.ctx.clearRect(CANVAS_CLEARTEXT_XOFFSET, CANVAS_CLEARTEXT_YOFFSET, CANVAS_CLEARTEXT_WIDTH, CANVAS_CLEARTEXT_HEIGHT);
        this.ctx.fillStyle = Config.FONT_COLOR_WHITE;
        this.drawText(gameStats['clearOutput'], Config.TEXT_FONT, Config.FONT_SIZE_SMALLEST, Config.FONT_COLOR_WHITE,
            CANVAS_CLEARTEXT_XOFFSET + CANVAS_CLEARTEXT_WIDTH / 2, CANVAS_CLEARTEXT_YOFFSET,
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
        this.ctx.clearRect(CANVAS_SCORETEXT_XOFFSET, CANVAS_SCORETEXT_YOFFSET, CANVAS_SCORETEXT_WIDTH, CANVAS_SCORETEXT_HEIGHT);
        this.ctx.clearRect(CANVAS_STATSTEXT_XOFFSET, CANVAS_STATSTEXT_YOFFSET, CANVAS_STATSTEXT_WIDTH, CANVAS_STATSTEXT_HEIGHT);
        this.drawText("SCORE: ", Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW,
            CANVAS_SCORETEXT_XOFFSET, CANVAS_SCORETEXT_YOFFSET + CANVAS_SCORETEXT_HEIGHT,
            "left", "bottom");
        this.drawText(score, Config.TEXT_FONT, Config.FONT_SIZE_SMALL, Config.FONT_COLOR_YELLOW,
            CANVAS_SCORETEXT_XOFFSET + CANVAS_SCORETEXT_WIDTH, CANVAS_SCORETEXT_YOFFSET + CANVAS_SCORETEXT_HEIGHT,
            "right", "bottom");
        const currentCombo = Math.max(0, gameStats['currentCombo']).toString();
        const level = gameStats['level'].toString();
        const linesCleared = gameStats['linesCleared'].toString();

        this.drawText(currentCombo, Config.TEXT_FONT, Config.FONT_SIZE_MEDIUM, Config.FONT_COLOR_WHITE,
            CANVAS_STATSTEXT_XOFFSET + CANVAS_STATSTEXT_WIDTH / 2, CANVAS_STATSTEXT_YOFFSET + 0,
            "center", "top");
        this.drawText("Combo", Config.TEXT_FONT, Config.FONT_SIZE_SMALLEST, Config.FONT_COLOR_WHITE,
            CANVAS_STATSTEXT_XOFFSET + CANVAS_STATSTEXT_WIDTH / 2, CANVAS_STATSTEXT_YOFFSET + 1 * TEXT_SPACER + Config.FONT_SIZE_MEDIUM,
            "center", "top");
        this.drawText(level, Config.TEXT_FONT, Config.FONT_SIZE_MEDIUM, Config.FONT_COLOR_WHITE,
            CANVAS_STATSTEXT_XOFFSET + CANVAS_STATSTEXT_WIDTH / 2, CANVAS_STATSTEXT_YOFFSET + 4 * TEXT_SPACER + Config.FONT_SIZE_MEDIUM + Config.FONT_SIZE_SMALLEST,
            "center", "top");
        this.drawText("Level", Config.TEXT_FONT, Config.FONT_SIZE_SMALLEST, Config.FONT_COLOR_WHITE,
            CANVAS_STATSTEXT_XOFFSET + CANVAS_STATSTEXT_WIDTH / 2, CANVAS_STATSTEXT_YOFFSET + 5 * TEXT_SPACER + 2 * Config.FONT_SIZE_MEDIUM + Config.FONT_SIZE_SMALLEST,
            "center", "top")
        this.drawText(linesCleared, Config.TEXT_FONT, Config.FONT_SIZE_MEDIUM, Config.FONT_COLOR_WHITE,
            CANVAS_STATSTEXT_XOFFSET + CANVAS_STATSTEXT_WIDTH / 2, CANVAS_STATSTEXT_YOFFSET + 8 * TEXT_SPACER + 2 * Config.FONT_SIZE_MEDIUM + 2 * Config.FONT_SIZE_SMALLEST,
            "center", "top");
        this.drawText("Lines Cleared", Config.TEXT_FONT, Config.FONT_SIZE_SMALLEST, Config.FONT_COLOR_WHITE,
            CANVAS_STATSTEXT_XOFFSET + CANVAS_STATSTEXT_WIDTH / 2, CANVAS_STATSTEXT_YOFFSET + 9 * TEXT_SPACER + 3 * Config.FONT_SIZE_MEDIUM + 2 * Config.FONT_SIZE_SMALLEST,
            "center", "top");
    }

    drawContainers() {
        this.ctx.setLineDash([]);
        this.ctx.lineDashOffset = 0;
        this.ctx.strokeStyle = BORDER_COLOR;
        this.ctx.lineWidth = BORDER_SIZE;
        this.ctx.lineCap = "round";
        this.ctx.strokeRect(CANVAS_HOLD_XOFFSET - BORDER_SIZE / 2, CANVAS_HOLD_YOFFSET - BORDER_SIZE / 2, CANVAS_HOLD_WIDTH + BORDER_SIZE, CANVAS_HOLD_HEIGHT + BORDER_SIZE);
        this.ctx.strokeRect(CANVAS_BOARD_XOFFSET - BORDER_SIZE / 2, CANVAS_BOARD_YOFFSET - BORDER_SIZE / 2, CANVAS_BOARD_WIDTH + BORDER_SIZE, CANVAS_BOARD_HEIGHT + BORDER_SIZE);
        this.ctx.strokeRect(CANVAS_QUEUE_XOFFSET - BORDER_SIZE / 2, CANVAS_QUEUE_YOFFSET - BORDER_SIZE / 2, CANVAS_QUEUE_WIDTH + BORDER_SIZE, CANVAS_QUEUE_HEIGHT + BORDER_SIZE);
        this.ctx.lineCap = "butt";
    }

    drawBackground() {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = GRID_SHADOW;
        this.ctx.beginPath();
        // Vertical lines
        for (let x = 0; x <= Constants.BOARD_WIDTH; x++) {
            this.ctx.moveTo(CANVAS_BOARD_XOFFSET + x * BOX_SIZE + 0.5, CANVAS_BOARD_YOFFSET + 0.5);
            this.ctx.lineTo(CANVAS_BOARD_XOFFSET + x * BOX_SIZE + 0.5, CANVAS_BOARD_YOFFSET + CANVAS_BOARD_HEIGHT + 0.5);
        }
        // Horizontal lines
        for (let y = 0; y <= Config.VISIBLE_BOARD_HEIGHT; y++) {
            this.ctx.moveTo(CANVAS_BOARD_XOFFSET + 0.5, CANVAS_BOARD_YOFFSET + y * BOX_SIZE + 0.5);
            this.ctx.lineTo(CANVAS_BOARD_XOFFSET + CANVAS_BOARD_WIDTH + 0.5, CANVAS_BOARD_YOFFSET + y * BOX_SIZE + 0.5);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([BOX_SIZE * 5 / 12, BOX_SIZE * 7 / 12])
        this.ctx.strokeStyle = GRID_HIGHLIGHT;
        this.ctx.lineDashOffset = BOX_SIZE * 5 / 26;
        this.ctx.stroke();
    }

    eraseAll() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    drawBoard(board) {
        for (let row = 0; row < Constants.BOARD_HEIGHT - Constants.BOARD_HEIGHT + Config.VISIBLE_BOARD_HEIGHT; row++) {
            for (let col = 0; col < Constants.BOARD_WIDTH; col++) {
                if (!board.isBlank(row + Constants.BOARD_HEIGHT - Config.VISIBLE_BOARD_HEIGHT, col)) {
                    this.drawBox(CANVAS_BOARD_XOFFSET, CANVAS_BOARD_YOFFSET, col, row, Config.PIECE_COLORS[board.board[row + Constants.BOARD_HEIGHT - Config.VISIBLE_BOARD_HEIGHT][col]]);
                }
            }
        }
    }

    drawHeldPiece(piece) {
        this.ctx.clearRect(CANVAS_HOLD_XOFFSET, CANVAS_HOLD_YOFFSET, CANVAS_HOLD_WIDTH, CANVAS_HOLD_HEIGHT);
        if (piece != null) {
            let x = 0.5;
            let y = 0.5;
            if (piece.shape == 'I') {
                x -= 0.5;
                y -= 0.5;
            } else if (piece.shape == 'O') {
                x -= 0.5;
            }
            this.drawPieceOffBoard(CANVAS_HOLD_XOFFSET, CANVAS_HOLD_YOFFSET, piece, x, y);
        }
    }

    drawQueue(queue = []) {
        this.ctx.clearRect(CANVAS_QUEUE_XOFFSET, CANVAS_QUEUE_YOFFSET, CANVAS_QUEUE_WIDTH, CANVAS_QUEUE_HEIGHT);
        for (let i = 0; i < queue.length; i++) {
            let x = 0.5;
            let y = i * 3 + 0.5;
            if (queue[i].shape == 'I') {
                x -= 0.5;
                y -= 0.5;
            } else if (queue[i].shape == 'O') {
                x -= 0.5;
            }
            this.drawPieceOffBoard(CANVAS_QUEUE_XOFFSET, CANVAS_QUEUE_YOFFSET, queue[i], x, y);
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
                this.drawBox(CANVAS_BOARD_XOFFSET, CANVAS_BOARD_YOFFSET, x, y, Config.SHADOW_COLORS[piece.shape]);
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