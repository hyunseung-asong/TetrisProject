export const MOVE_SIDEWAYS_OFFSET = 0.15 * 1000;
export const MOVE_SIDEWAYS_FREQ = 0.04 * 1000;
export const MOVE_DOWN_FREQ = 0.04 * 1000;
export const FALL_FREQ = 1.5 * 1000;
export const NUM_NEXT_PIECES = 5;
export const KEYBINDS = {
    'move_left': "ArrowLeft",
    'move_right': "ArrowRight",
    'softdrop': "ArrowDown",
    'harddrop': " ",
    'rotate_left': "z",
    'rotate_right': "ArrowUp",
    'hold': "Shift",
    'pause': "p",
    'restart': "r"
}

export const PIECE_COLOR = {
    'I': 'rgba(0, 255, 255, 255)',
    'T': 'rgba(128, 0, 128, 255)',
    'L': 'rgba(255, 165, 0, 255)',
    'J': 'rgba(0, 0, 255, 255)',
    'Z': 'rgba(255, 0, 0, 255)',
    'S': 'rgba(0, 255, 0, 255)',
    'O': 'rgba(255, 255, 0, 255)'
};

export const SHADOW_COLOR = {
    'I': 'rgba(0, 255, 255, 150)',
    'T': 'rgba(128, 0, 128, 150)',
    'L': 'rgba(255, 165, 0, 150)',
    'J': 'rgba(0, 0, 255, 150)',
    'Z': 'rgba(255, 0, 0, 150)',
    'S': 'rgba(0, 255, 0, 150)',
    'O': 'rgba(255, 255, 0, 150)'
};

export const 
WINDOW_WIDTH = 500,
WINDOW_HEIGHT = 700,
BACKGROUND_COLOR = "BLACK",
BORDER_COLOR = "WHITE",
GRID_COLOR = "GRAY10",
FONT_SIZE = 36,
TEXT_FONT = "Montserrat-Medium.ttf",
FONT_COLOR = "YELLOW2",
FONT_BACKGROUND_COLOR = "GRAY40",
BORDER_THICKNESS = 5,
GRID_THICKNESS = 1,
BOX_SIZE = 20;

// export const X_MARGIN = (WINDOW_WIDTH / 2) - (BOARD_WIDTH * BOX_SIZE / 2);
// export const Y_MARGIN = (WINDOW_HEIGHT / 2) - (VISIBLE_BOARD_HEIGHT * BOX_SIZE / 2);