import random, time, pygame, sys
from pygame.locals import *

WINDOW_WIDTH = 500
WINDOW_HEIGHT = 700
BACKGROUND_COLOR = "BLACK"
BORDER_COLOR = "WHITE"
GRID_COLOR = "GRAY30"

BORDER_THICKNESS = 5
GRID_THICKNESS = 1
FPS = 60

BOARD_WIDTH = 10
# VISIBLE_BOARD_HEIGHT = 20
BOARD_HEIGHT = 24
BOX_SIZE = 20
BLANK = 0

MOVE_SIDEWAYS_FREQ = 0.15
MOVE_DOWN_FREQ = 0.1
FALL_FREQ = 0.5

X_MARGIN = (WINDOW_WIDTH / 2) - (BOARD_WIDTH * BOX_SIZE / 2)
Y_MARGIN = (WINDOW_HEIGHT / 2) - (BOARD_HEIGHT * BOX_SIZE / 2)

I_PIECE = [[[0, 0, 0, 0],
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
            [0, 1, 0, 0]]]

T_PIECE = [[[0, 1, 0],
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
            [0, 1, 0]]]

L_PIECE = [[[0, 0, 1],
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
            [0, 1, 0]]]

J_PIECE = [[[1, 0, 0],
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
            [1, 1, 0]]]

Z_PIECE = [[[1, 1, 0],
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
            [1, 0, 0]]]

S_PIECE = [[[0, 1, 1],
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
            [0, 1, 0]]]

O_PIECE = [[[0, 1, 1, 0],
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
            [0, 0, 0, 0]]]

PIECE_SHAPES = {'I': I_PIECE,
                'T': T_PIECE,
                'L': L_PIECE,
                'J': J_PIECE,
                'Z': Z_PIECE,
                'S': S_PIECE,
                'O': O_PIECE}
PIECE_COLORS = {'I': Color(0, 255, 255, 255),
                'T': Color(128, 0, 128, 255),
                'L': Color(255, 165, 0, 255),
                'J': Color(0, 0, 255, 255),
                'Z': Color(255, 0, 0, 255),
                'S': Color(0, 255, 0, 255),
                'O': Color(255, 255, 0, 255)}
SHADOW_COLORS = {'I': Color(0, 255, 255, 150),
                 'T': Color(128, 0, 128, 150),
                 'L': Color(255, 165, 0, 150),
                 'J': Color(0, 0, 255, 150),
                 'Z': Color(255, 0, 0, 150),
                 'S': Color(0, 255, 0, 150),
                 'O': Color(255, 255, 0, 150)}

WALLKICK_JLSTZ = [
    [(0, 0), (-1, 0), (-1, +1), (0, -2), (-1, -2)],  # 0->R   0->1
    [(0, 0), (+1, 0), (+1, -1), (0, +2), (+1, +2)],  # R->0   1->0
    [(0, 0), (+1, 0), (+1, -1), (0, +2), (+1, +2)],  # R->2   1->2
    [(0, 0), (-1, 0), (-1, +1), (0, -2), (-1, -2)],  # 2->R   2->1
    [(0, 0), (+1, 0), (+1, +1), (0, -2), (+1, -2)],  # 2->L   2->3
    [(0, 0), (-1, 0), (-1, -1), (0, +2), (-1, +2)],  # L->2   3->2
    [(0, 0), (-1, 0), (-1, -1), (0, +2), (-1, +2)],  # L->0   3->0
    [(0, 0), (+1, 0), (+1, +1), (0, -2), (+1, -2)]  # 0->L   0->3
]

WALLKICK_I = [
    [(0, 0), (-2, 0), (+1, 0), (-2, -1), (+1, +2)],  # 0->R   0->1
    [(0, 0), (+2, 0), (-1, 0), (+2, +1), (-1, -2)],  # R->0   1->0
    [(0, 0), (-1, 0), (+2, 0), (-1, +2), (+2, -1)],  # R->2   1->2
    [(0, 0), (+1, 0), (-2, 0), (+1, -2), (-2, +1)],  # 2->R   2->1
    [(0, 0), (+2, 0), (-1, 0), (+2, +1), (-1, -2)],  # 2->L   2->3
    [(0, 0), (-2, 0), (+1, 0), (-2, -1), (+1, +2)],  # L->2   3->2
    [(0, 0), (+1, 0), (-2, 0), (+1, -2), (-2, +1)],  # L->0   3->0
    [(0, 0), (-1, 0), (+2, 0), (-1, +2), (+2, -1)]  # 0->L   0->3
]


def main():
    global CLOCK, SCREEN
    pygame.init()
    SCREEN = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
    CLOCK = pygame.time.Clock()
    run_game()


# TO DO:
# move down and place on timer
# end game conditions
# hold down keys
#



def run_game():
    # game setup
    board = new_board()
    piece_bag = list(PIECE_SHAPES.keys())
    curr_piece = get_new_piece(piece_bag)
    next_piece = get_new_piece(piece_bag)
    game_over = False

    # game loop
    while not game_over:
        check_for_quit()
        event_occurred = False
        for event in pygame.event.get():
            # key pressed
            if event.type == KEYDOWN:
                event_occurred = True

                if event.key == K_LEFT:
                    move_piece(board, curr_piece, -1, 0)
                elif event.key == K_RIGHT:
                    move_piece(board, curr_piece, 1, 0)
                elif event.key == K_DOWN:
                    move_piece(board, curr_piece, 0, 1)

                elif event.key == K_UP:
                    # rotate clockwise
                    rotate_piece(board, curr_piece, 1)
                elif event.key == K_z:
                    # rotate counterclockwise
                    rotate_piece(board, curr_piece, -1)
                elif event.key == K_SPACE:
                    for i in range(1, BOARD_HEIGHT):
                        if not is_valid_position(board, curr_piece, adjy=i):
                            break
                    curr_piece['y'] += i - 1

                    add_to_board(board, curr_piece)
                    curr_piece = next_piece
                    if not piece_bag:
                        piece_bag = list(PIECE_SHAPES.keys())
                    next_piece = get_new_piece(piece_bag)

        remove_complete_lines(board)

        draw_background()
        draw_board(board)
        draw_piece_shadow(board, curr_piece)
        draw_piece(curr_piece)
        pygame.display.update()
        # if event_occurred:
        #     print_board_with_piece(board, curr_piece)


def move_piece(board, piece, adjx, adjy):
    if is_valid_position(board, piece, adjx, adjy):
        piece['x'] += adjx
        piece['y'] += adjy


def rotate_piece(board, piece, adj_rot):
    # 0 = 0, 1 = R, 2 = 2, 3 = L
    len_rots = len(PIECE_SHAPES[piece['shape']])
    rot = (piece['rotation'], (piece['rotation'] + adj_rot) % len_rots)
    match rot:
        case (0, 1):
            i = 0
        case (1, 0):
            i = 1
        case (1, 2):
            i = 2
        case (2, 1):
            i = 3
        case (2, 3):
            i = 4
        case (3, 2):
            i = 5
        case (3, 0):
            i = 6
        case (0, 3):
            i = 7

    if piece['shape'] in ['J', 'L', 'S', 'T', 'Z']:
        for test in WALLKICK_JLSTZ[i]:
            _, piece['rotation'] = rot  # set new rotation
            # adjust x, y according to test
            testx, testy = test
            piece['x'] += testx
            piece['y'] -= testy  # -= because positive y in test goes up. (positive y in board goes down)
            if is_valid_position(board, piece):
                break
            # test didnt work, undo
            piece['rotation'], _ = rot
            piece['x'] -= testx
            piece['y'] += testy

    elif piece['shape'] == 'I':
        for test in WALLKICK_I[i]:
            _, piece['rotation'] = rot  # set new rotation
            # adjust x, y according to test
            testx, testy = test
            piece['x'] += testx
            piece['y'] -= testy  # -= because positive y in test goes up. (positive y in board goes down)
            if is_valid_position(board, piece):
                break
            # test didnt work, undo
            piece['rotation'], _ = rot
            piece['x'] -= testx
            piece['y'] += testy


def is_valid_position(board, piece, adjx=0, adjy=0):
    template = PIECE_SHAPES[piece['shape']][piece['rotation']]
    for yrow in range(len(template)):
        for xcol in range(len(template[0])):
            piece_x = xcol + piece['x'] + adjx
            piece_y = yrow + piece['y'] + adjy
            is_above_board = piece_y < 0
            if is_above_board or template[yrow][xcol] == BLANK:
                continue
            if not is_on_board(piece_y, piece_x):
                return False
            if board[piece_y][piece_x] != BLANK:
                return False
    return True


def remove_complete_lines(board):
    num_removed_lines = 0
    yrow = BOARD_HEIGHT - 1
    while yrow >= 0:
        if is_complete_line(board, yrow):
            for pull_down_y in range(yrow, 0, -1):
                for xcol in range(BOARD_WIDTH):
                    board[pull_down_y][xcol] = board[pull_down_y - 1][xcol]
            for xcol in range(BOARD_WIDTH):
                board[0][xcol] = BLANK
            num_removed_lines += 1
        else:
            yrow -= 1
    return num_removed_lines


def is_complete_line(board, yrow):
    for xcol in range(BOARD_WIDTH):
        if board[yrow][xcol] == BLANK:
            return False
    return True


def is_on_board(yrow, xcol):
    return 0 <= xcol < BOARD_WIDTH and yrow < BOARD_HEIGHT


# solidifies the falling piece onto the current board state
def add_to_board(board, piece):
    template = PIECE_SHAPES[piece['shape']][piece['rotation']]
    for yrow in range(len(template)):
        for xcol in range(len(template[0])):
            if template[yrow][xcol] != BLANK:
                board[yrow + piece['y']][xcol + piece['x']] = piece['shape']


# returns a new piece from the current bag of pieces
def get_new_piece(bag):
    shape = random.choice(list(bag))
    bag.remove(shape)
    new_piece = {'shape': shape, 'rotation': 0, 'x': 3, 'y': 3, 'color': PIECE_COLORS[shape]}
    return new_piece


# returns a blank board state
def new_board():
    board = [[BLANK for xcol in range(BOARD_WIDTH)]
             for yrow in range(BOARD_HEIGHT)]
    return board


def draw_background():
    # "erase" everything
    SCREEN.fill(BACKGROUND_COLOR)
    # draw playfield border
    pygame.draw.rect(SCREEN, BORDER_COLOR,
                     (X_MARGIN - BORDER_THICKNESS,
                      Y_MARGIN - BORDER_THICKNESS,
                      BOARD_WIDTH * BOX_SIZE + 2 * BORDER_THICKNESS,
                      BOARD_HEIGHT * BOX_SIZE + 2 * BORDER_THICKNESS), BORDER_THICKNESS)

    # draw grid
    for yrow in range(BOARD_HEIGHT):
        for xcol in range(BOARD_WIDTH):
            draw_box(yrow, xcol, GRID_COLOR, GRID_THICKNESS)


def draw_box(yrow, xcol, color, thickness, pixely=None, pixelx=None):
    if pixely is None and pixelx is None:
        pixely, pixelx = convert_to_pixel_coords(yrow, xcol)
    # thickness 0 = fill
    # thickness > 0 = border inside the rect
    # thickness < 0 = nothing
    pygame.draw.rect(SCREEN, color, (pixelx, pixely, BOX_SIZE, BOX_SIZE), thickness)


def draw_board(board):
    for yrow in range(BOARD_HEIGHT):
        for xcol in range(BOARD_WIDTH):
            if board[yrow][xcol] != BLANK:
                draw_box(yrow, xcol, PIECE_COLORS[board[yrow][xcol]], 0)
                draw_box(yrow, xcol, GRID_COLOR, GRID_THICKNESS)


def draw_piece(piece, pixely=None, pixelx=None):
    template = PIECE_SHAPES[piece['shape']][piece['rotation']]
    # if pixely is None and pixely is None:
    #     pixely, pixelx = convert_to_pixel_coords(piece['y'], piece['x'])
    for yrow in range(len(template)):
        for xcol in range(len(template[0])):
            if template[yrow][xcol] != BLANK:
                draw_box(yrow + piece['y'], xcol + piece['x'], piece['color'], 0)
                draw_box(yrow + piece['y'], xcol + piece['x'], GRID_COLOR, GRID_THICKNESS)


def draw_piece_shadow(board, piece):
    for i in range(1, BOARD_HEIGHT):
        if not is_valid_position(board, piece, adjy=i):
            break
    shadow = {'shape': piece['shape'], 'rotation': piece['rotation'],
              'x': piece['x'], 'y': piece['y'] + i - 1, 'color': SHADOW_COLORS[piece['shape']]}
    shadow['color'] = shadow['color'].premul_alpha()
    template = PIECE_SHAPES[shadow['shape']][shadow['rotation']]
    for yrow in range(len(template)):
        for xcol in range(len(template[0])):
            if template[yrow][xcol] != BLANK:
                draw_box(yrow + shadow['y'], xcol + shadow['x'], shadow['color'], 0)
                draw_box(yrow + shadow['y'], xcol + shadow['x'], GRID_COLOR, GRID_THICKNESS)


def convert_to_pixel_coords(y, x):
    return Y_MARGIN + y * BOX_SIZE, X_MARGIN + x * BOX_SIZE


def print_board(board):
    print("----------------------------------------------------")
    for yrow in range(len(board)):
        row = ""
        for xcol in range(len(board[0])):
            if board[yrow][xcol] == BLANK:
                row += '.'
            else:
                row += board[yrow][xcol]
        print(row)


def print_board_with_piece(board, piece):
    template = PIECE_SHAPES[piece['shape']][piece['rotation']]

    xys = []
    for template_yrow in range(len(template)):
        for template_xcol in range(len(template[0])):
            if template[template_yrow][template_xcol] != BLANK:
                xys.append((template_yrow + piece['y'], template_xcol + piece['x']))

    print("----------------------------------------------------")
    for yrow in range(len(board)):
        row = ""
        for xcol in range(len(board[0])):
            grid = (yrow, xcol)
            if grid in xys:
                row += piece['shape']
            elif board[yrow][xcol] != BLANK:
                row += board[yrow][xcol]
            else:
                row += '.'
        print(row)


def check_for_quit():
    for event in pygame.event.get(QUIT):
        terminate()


def terminate():
    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()
