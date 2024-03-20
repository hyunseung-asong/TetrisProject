export const
    // game settings (time in ms)
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
    READY_SCREEN_TIMER = 1 * 1000,
    MOVE_SIDEWAYS_OFFSET = 0.15 * 1000,
    MOVE_SIDEWAYS_FREQ = 0.02 * 1000,
    MOVE_DOWN_FREQ = 0.04 * 1000,
    FALL_FREQ = 1.5 * 1000,

    // appearance settings
    FPS = 30,
    VISIBLE_BOARD_HEIGHT = 20,
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

    

    // font settings
    FONT_SIZE = 36,
    TEXT_FONT = "Montserrat-Medium",
    TEXT_FONT_LOCATION = "static/fonts/Montserrat-Medium.ttf",
    FONT_SIZE_LARGE = 36,
    FONT_SIZE_MEDIUM = 30,
    FONT_SIZE_SMALL = 24,
    FONT_SIZE_SMALLEST = 12,
    FONT_COLOR_YELLOW = 'rgba(238, 238, 0, 1)',
    FONT_COLOR_WHITE = 'rgba(255, 255, 255, 1)',
    FONT_BACKGROUND_COLOR = 'rgba(155, 155, 155, 1)'
    ;
