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
    MOVE_SIDEWAYS_FREQ = 0.02 * 1000,
    MOVE_DOWN_FREQ = 0.04 * 1000,
    FALL_FREQ = 1.5 * 1000,


    ACTION_SCORE = {
        'None': 0,
        'Single': 100,
        'Double': 300,
        'Triple': 500,
        'Tetris': 800,
        'Mini T-Spin no lines': 100,
        'T-Spin no lines': 200,
        'Mini T-Spin Single': 200,
        'T-Spin Single': 800,
        'Mini T-Spin Double': 400,
        'T-Spin Double': 1200,
        'T-Spin Triple': 1600,
        'Softdrop': 1,
        'Harddrop': 2,
        'Combo': 50,
        'Single PC': 800,
        'Double PC': 1200,
        'Triple PC': 1800,
        'Tetris PC': 2000,
        'B2B Tetris PC': 3200
    },

    ACTION_DIFFICULTY = {
        'None': false,
        'Single': false,
        'Double': false,
        'Triple': false,
        'Tetris': true,
        'Mini T-Spin no lines': false,
        'T-Spin no lines': false,
        'Mini T-Spin Single': true,
        'T-Spin Single': true,
        'Mini T-Spin Double': true,
        'T-Spin Double': true,
        'T-Spin Triple': true,
        'Softdrop': false,
        'Harddrop': false,
        'Combo': false,
        'Single PC': true,
        'Double PC': true,
        'Triple PC': true,
        'Tetris PC': true,
        'B2B Tetris PC': true
    },

    ACTION_BACK_TO_BACK_CHAIN_BREAK = {
        'None': false,
        'Single': true,
        'Double': true,
        'Triple': true,
        'Tetris': false,
        'Mini T-Spin no lines': false,
        'T-Spin no lines': false,
        'Mini T-Spin Single': false,
        'T-Spin Single': false,
        'Mini T-Spin Double': false,
        'T-Spin Double': false,
        'T-Spin Triple': false,
        'Softdrop': false,
        'Harddrop': false,
        'Combo': false,
        'Single PC': false,
        'Double PC': false,
        'Triple PC': false,
        'Tetris PC': false,
        'B2B Tetris PC': false
    },




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
        'I': 'rgba(0, 255, 255, 0.45)',
        'T': 'rgba(128, 0, 128, 0.45)',
        'L': 'rgba(255, 165, 0, 0.45)',
        'J': 'rgba(0, 0, 255, 0.45)',
        'Z': 'rgba(255, 0, 0, 0.45)',
        'S': 'rgba(0, 255, 0, 0.45)',
        'O': 'rgba(255, 255, 0, 0.45)'
    },

    GRID_HIGHLIGHT = 'rgba(30, 30, 30, 1)',
    GRID_SHADOW = 'rgba(18, 18, 18, 1)',
    BOX_SIZE = 25,

    // font settings
    FONT_SIZE = 36,
    TEXT_FONT = "Montserrat-Medium",
    TEXT_FONT_LOCATION = "static/fonts/Montserrat-Medium.ttf",
    FONT_SIZE_LARGE = 36,
    FONT_SIZE_SMALL = 24,
    FONT_SIZE_SMALLEST = 12,
    FONT_COLOR_YELLOW = 'rgba(238, 238, 00, 1)',
    FONT_BACKGROUND_COLOR = 'rgba(155, 155, 155, 0.8)'
    ;
