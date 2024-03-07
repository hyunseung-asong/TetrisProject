
export const
    BOARD_WIDTH = 10,
    BOARD_HEIGHT = 24,
    VISIBLE_BOARD_HEIGHT = 20,
    NUM_NEXT_PIECES = 5,
    I_PIECE = [
        [[0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]],
        [[0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]],
        [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]],
        [[0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]]],
    T_PIECE = [
        [[0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]],
        [[0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]],
        [[0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]],
        [[0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]]],
    L_PIECE = [
        [[0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]],
        [[0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]],
        [[0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]],
        [[1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]]],
    J_PIECE = [
        [[1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]],
        [[0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]],
        [[0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]],
        [[0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]]],
    Z_PIECE = [
        [[1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]],
        [[0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]],
        [[0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]],
        [[0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]]],
    S_PIECE = [
        [[0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]],
        [[0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]],
        [[0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]],
        [[1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]]],
    O_PIECE = [
        [[0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]],
        [[0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]],
        [[0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]],
        [[0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]]],
    PIECE_SHAPES = {
        'I': I_PIECE,
        'T': T_PIECE,
        'L': L_PIECE,
        'J': J_PIECE,
        'Z': Z_PIECE,
        'S': S_PIECE,
        'O': O_PIECE
    },
    WALLKICK_JLSTZ = [
        [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],  // 0->R   0->1
        [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],  // R->0   1->0
        [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],  // R->2   1->2
        [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],  // 2->R   2->1
        [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],  // 2->L   2->3
        [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],  // L->2   3->2
        [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],  // L->0   3->0
        [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]  // 0->L   0->3
    ],
    WALLKICK_I = [
        [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],  // 0->R   0->1
        [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],  // R->0   1->0
        [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],  // R->2   1->2
        [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],  // 2->R   2->1
        [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],  // 2->L   2->3
        [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],  // L->2   3->2
        [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],  // L->0   3->0
        [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]  // 0->L   0->3
    ],
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
    }
    ;
