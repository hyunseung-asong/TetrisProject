
export const
    // base game
    BOARD_WIDTH = 10,
    VISIBLE_BOARD_HEIGHT = 20,
    BOARD_HEIGHT = 24,
    BLANK = 0,
    NUM_NEXT_PIECES = 5,

    // controls

    KEYBINDS = {
        'move_left': "ArrowLeft",
        'move_right': "ArrowRight",
        'softdrop': "ArrowDown",
        'harddrop': " ",
        'rotate_left': "z",
        'rotate_right': "ArrowUp",
        'hold': "Shift",
        'pause': "p",
        'restart': "r"
    },

    // game settings (time in ms)
    FPS = 60,
    READY_SCREEN_TIMER = 1 * 1000,
    MOVE_SIDEWAYS_OFFSET = 0.15 * 1000,
    MOVE_SIDEWAYS_FREQ = 0.04 * 1000,
    MOVE_DOWN_FREQ = 0.04 * 1000,
    FALL_FREQ = 1.5 * 1000,


    // appearance settings
    PIECE_COLORS = {
        'I': 'rgba(0, 255, 255, 1)',
        'T': 'rgba(128, 0, 128, 1)',
        'L': 'rgba(255, 165, 0, 1)',
        'J': 'rgba(0, 0, 255, 1)',
        'Z': 'rgba(255, 0, 0, 1)',
        'S': 'rgba(0, 255, 0, 1)',
        'O': 'rgba(255, 255, 0, 1)'
    },
    SHADOW_COLORS = {
        'I': 'rgba(0, 255, 255, 0.6)',
        'T': 'rgba(128, 0, 128, 0.6)',
        'L': 'rgba(255, 165, 0, 0.6)',
        'J': 'rgba(0, 0, 255, 0.6)',
        'Z': 'rgba(255, 0, 0, 0.6)',
        'S': 'rgba(0, 255, 0, 0.6)',
        'O': 'rgba(255, 255, 0, 0.6)'
    },

    GRID_HIGHLIGHT = 'rgba(155, 155, 155, 1)',
    GRID_SHADOW = 'rgba(100, 100, 100, 1)',
    GRID_THICKNESS = 1,
    BOX_SIZE = 25,

    // WINDOW_WIDTH = 500,
    // WINDOW_HEIGHT = 700,
    // BACKGROUND_COLOR = 'rgba(0, 0, 0, 1)',
    // BORDER_COLOR = 'rgba(0, 0, 0, 1)',
    // GRID_COLOR = 'rgba(230, 230, 230, 1)',
    // BORDER_THICKNESS = 5,
    //  X_MARGIN = (WINDOW_WIDTH / 2) - (BOARD_WIDTH * BOX_SIZE / 2);
    //  Y_MARGIN = (WINDOW_HEIGHT / 2) - (VISIBLE_BOARD_HEIGHT * BOX_SIZE / 2);

    // font settings
    FONT_SIZE = 36,
    TEXT_FONT = "../static/fonts/Montserrat-Medium.ttf",
    FONT_COLOR = 'rgba(238, 238, 00, 1)',
    FONT_BACKGROUND_COLOR = 'rgba(155, 155, 155, 1)'
    ;