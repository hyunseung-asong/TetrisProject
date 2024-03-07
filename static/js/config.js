export const
    VISIBLE_BOARD_HEIGHT = 20,

    KEYBINDS = {
        'MoveLeft': "ArrowLeft",
        'MoveRight': "ArrowRight",
        'Softdrop': "ArrowDown",
        'Harddrop': " ",
        'RotateCCW': "z",
        'RotateCW': "ArrowUp",
        'Hold': "Shift",
        'Pause': "p",
        'Restart': "r"
    },

    // game settings (time in ms)
    FPS = 30,
    READY_SCREEN_TIMER = 1 * 1000,
    MOVE_SIDEWAYS_OFFSET = 0.15 * 1000,
    MOVE_SIDEWAYS_FREQ = 0.02 * 1000,
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
