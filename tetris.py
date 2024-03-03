import random, time, pygame, sys
from pygame.locals import *

KEYBINDS = {'move_left': K_LEFT,
            'move_right': K_RIGHT,
            'softdrop': K_DOWN,
            'harddrop': K_SPACE,
            'rotate_left': K_z,
            'rotate_right': K_UP,
            'hold': K_LSHIFT,
            'pause': K_p,
            'restart': K_r}

WINDOW_WIDTH = 500
WINDOW_HEIGHT = 700
BACKGROUND_COLOR = "BLACK"
BORDER_COLOR = "WHITE"
GRID_COLOR = "GRAY10"
FONT_SIZE = 36
TEXT_FONT = "Montserrat-Medium.ttf"
FONT_COLOR = "YELLOW2"
FONT_BACKGROUND_COLOR = "GRAY40"

BORDER_THICKNESS = 5
GRID_THICKNESS = 1
FPS = 60

BOARD_WIDTH = 10
VISIBLE_BOARD_HEIGHT = 20
BOARD_HEIGHT = 24
BOX_SIZE = 20
BLANK = 0

MOVE_SIDEWAYS_OFFSET = 0.15
MOVE_SIDEWAYS_FREQ = 0.04
MOVE_DOWN_FREQ = 0.04
FALL_FREQ = 1.5
READY_SCREEN_TIMER = 1

X_MARGIN = (WINDOW_WIDTH / 2) - (BOARD_WIDTH * BOX_SIZE / 2)
Y_MARGIN = (WINDOW_HEIGHT / 2) - (VISIBLE_BOARD_HEIGHT * BOX_SIZE / 2)
OTHER_PIECE_OFFSET = BOX_SIZE

NUM_NEXT_PIECES = 5

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
    pygame.font.init()
    SCREEN = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
    CLOCK = pygame.time.Clock()
    if run_game():
        main()


def run_game():
    # game setup
    board = new_board()
    piece_bag = list(PIECE_SHAPES.keys())
    # curr_piece = get_new_piece(piece_bag)
    curr_piece = None
    next_pieces = [get_new_piece(piece_bag) for _ in range(NUM_NEXT_PIECES)]
    held_piece = None
    piece_held_this_turn = False
    swap_hold_available = True
    game_over = False
    ready_go_screen = True
    draw_ready = False
    draw_go = False
    ready_screen_time = time.time()

    paused = False
    inital_move_side_done = False
    last_move_down_time = time.time()
    last_move_side_time = time.time()
    last_move_side_pressed = time.time()
    last_fall_time = time.time()
    moving_left = False
    moving_right = False
    moving_down = False
    piece_placed = False

    # game loop
    while True:
        check_for_quit()

        if not game_over:

            if not ready_go_screen:
                # get next piece
                if curr_piece is None:
                    curr_piece = next_pieces[0]
                    if not is_valid_position(board, curr_piece):
                        move_piece(board, curr_piece, 0, -1)
                    if not piece_bag:
                        piece_bag = list(PIECE_SHAPES.keys())
                    for i in range(NUM_NEXT_PIECES - 1):
                        next_pieces[i] = next_pieces[i + 1]
                    next_pieces[NUM_NEXT_PIECES - 1] = get_new_piece(piece_bag)

                for event in pygame.event.get():
                    # key pressed
                    if event.type == KEYUP:
                        if event.key == KEYBINDS['move_left']:
                            moving_left = False
                            inital_move_side_done = False
                        elif event.key == KEYBINDS['move_right']:
                            moving_right = False
                            inital_move_side_done = False
                        elif event.key == KEYBINDS['softdrop']:
                            moving_down = False
                    elif event.type == KEYDOWN:
                        if not paused:
                            if event.key == KEYBINDS['move_left']:
                                move_piece(board, curr_piece, -1, 0)
                                moving_left = True
                                last_move_side_time = time.time()
                                if not inital_move_side_done:
                                    inital_move_side_done = True
                                    last_move_side_pressed = time.time()
                            elif event.key == KEYBINDS['move_right']:
                                move_piece(board, curr_piece, 1, 0)
                                moving_right = True
                                if not inital_move_side_done:
                                    inital_move_side_done = True
                                    last_move_side_pressed = time.time()
                            elif event.key == KEYBINDS['softdrop']:
                                move_piece(board, curr_piece, 0, 1)
                                moving_down = True
                                last_move_down_time = time.time()
                            elif event.key == KEYBINDS['rotate_right']:
                                rotate_piece(board, curr_piece, 1)
                            elif event.key == KEYBINDS['rotate_left']:
                                rotate_piece(board, curr_piece, -1)
                            elif event.key == KEYBINDS['harddrop']:
                                for i in range(1, BOARD_HEIGHT):
                                    if not is_valid_position(board, curr_piece, adjy=i):
                                        break
                                curr_piece['y'] += i - 1
                                piece_placed = True
                                moving_down = False
                                moving_left = False
                                moving_right = False
                            elif event.key == KEYBINDS['hold']:
                                if swap_hold_available:
                                    if held_piece is None:
                                        held_piece = {'shape': curr_piece['shape'], 'rotation': 0,
                                                      'x': 3, 'y': 3, 'color': PIECE_COLORS[curr_piece['shape']]}
                                        piece_held_this_turn = True
                                    else:
                                        temp_piece = curr_piece
                                        curr_piece = held_piece
                                        held_piece = {'shape': temp_piece['shape'], 'rotation': 0,
                                                      'x': 3, 'y': 3, 'color': PIECE_COLORS[temp_piece['shape']]}
                                    swap_hold_available = False
                        if event.key == KEYBINDS['pause']:
                            paused = not paused
                        elif event.key == KEYBINDS['restart']:
                            # restart game
                            return True

                if not paused:
                    # continue moving side if key is held
                    if inital_move_side_done and time.time() - last_move_side_pressed > MOVE_SIDEWAYS_OFFSET:
                        if (moving_left or moving_right) and time.time() - last_move_side_time > MOVE_SIDEWAYS_FREQ:
                            if moving_left:
                                move_piece(board, curr_piece, -1, 0)
                            elif moving_right:
                                move_piece(board, curr_piece, 1, 0)
                            last_move_side_time = time.time()

                    # continue moving down if key is held (softdrop)
                    if moving_down and time.time() - last_move_down_time > MOVE_DOWN_FREQ:
                        move_piece(board, curr_piece, 0, 1)
                        last_move_down_time = time.time()
                        last_fall_time = time.time()

                    # let piece fall naturally
                    if FALL_FREQ < time.time() - last_fall_time:
                        # solidify piece
                        if is_valid_position(board, curr_piece, 0, 1):
                            curr_piece['y'] += 1
                            last_fall_time = time.time()
                        else:
                            piece_placed = True
                            moving_down = False
                            moving_left = False
                            moving_right = False
            else:
                if READY_SCREEN_TIMER > time.time() - ready_screen_time:
                    # ready_screen
                    draw_ready = True
                elif READY_SCREEN_TIMER * 2 > time.time() - ready_screen_time:
                    # go screen
                    draw_go = True
                    draw_ready = False
                else:
                    draw_ready = False
                    draw_go = False
                    ready_go_screen = False

            remove_complete_lines(board)

            # "erase" everything
            SCREEN.fill(BACKGROUND_COLOR)
            draw_background()
            draw_board(board)

            if curr_piece is not None:
                draw_piece_shadow(board, curr_piece)
                draw_piece(curr_piece)
                print_board_with_piece(board, curr_piece)
            if next_pieces is not None:
                draw_next_pieces(next_pieces)
            if held_piece is not None:
                draw_held_piece(held_piece)
            if piece_placed:
                if not is_valid_position(board, curr_piece, 0, 0):
                    game_over = True
                    print("gg")
                add_to_board(board, curr_piece)
                curr_piece = None
                piece_placed = False
                swap_hold_available = True
                last_fall_time = time.time()
                last_move_side_time = time.time()
                last_move_side_pressed = time.time()
                last_move_down_time = time.time()
            if piece_held_this_turn:
                curr_piece = None
                piece_held_this_turn = False

            if draw_ready:
                draw_text("READY", TEXT_FONT, FONT_SIZE, FONT_COLOR, FONT_BACKGROUND_COLOR)
            if draw_go:
                draw_text("GO!", TEXT_FONT, FONT_SIZE, FONT_COLOR, FONT_BACKGROUND_COLOR)
            if paused:
                draw_text("PAUSED", TEXT_FONT, FONT_SIZE, FONT_COLOR, FONT_BACKGROUND_COLOR)

            pygame.display.update()


# returns True if moved successfully, False otherwise
def move_piece(board, piece, adjx, adjy):
    if is_valid_position(board, piece, adjx, adjy):
        piece['x'] += adjx
        piece['y'] += adjy
        return True
    return False


# rotates piece based on current position and rotation while allowing for wall kicks
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


# returns true if the given position with adjusted x and y is within the board
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


# removes any complete lines and pushes down the rest of the board
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


# returns true if the given row is full
def is_complete_line(board, yrow):
    for xcol in range(BOARD_WIDTH):
        if board[yrow][xcol] == BLANK:
            return False
    return True


# returns true if given x y is within the board
def is_on_board(yrow, xcol):
    return 0 <= xcol < BOARD_WIDTH and yrow < BOARD_HEIGHT


# solidifies a piece onto the current board state
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


# draws text near the center of the playfield unless specified otherwise
def draw_text(text, font, size, color, background_color, pixely=None, pixelx=None):
    if pixely is None and pixelx is None:
        new_font = pygame.font.Font(font, size)
        text_surface = new_font.render(text, True, color, background_color)
        pygame.draw.rect(SCREEN, FONT_BACKGROUND_COLOR,
                         (X_MARGIN,
                          Y_MARGIN + VISIBLE_BOARD_HEIGHT / 2 * BOX_SIZE,
                          BOARD_WIDTH * BOX_SIZE,
                          3 * BOX_SIZE), 0)
        SCREEN.blit(text_surface,
                    (X_MARGIN + BOARD_WIDTH / 2 * BOX_SIZE - text_surface.get_width() / 2,
                     Y_MARGIN + VISIBLE_BOARD_HEIGHT / 2 * BOX_SIZE + 3 / 2 * BOX_SIZE - text_surface.get_height() / 2))


# erases and draws the border for playfield, held, and next pieces. also draws the grid within the playfield
def draw_background():
    # draw playfield border
    pygame.draw.rect(SCREEN, BORDER_COLOR,
                     (X_MARGIN - BORDER_THICKNESS,
                      Y_MARGIN - BORDER_THICKNESS,
                      BOARD_WIDTH * BOX_SIZE + 2 * BORDER_THICKNESS,
                      VISIBLE_BOARD_HEIGHT * BOX_SIZE + 2 * BORDER_THICKNESS), BORDER_THICKNESS)

    # draw grid
    for yrow in range(VISIBLE_BOARD_HEIGHT):
        for xcol in range(BOARD_WIDTH):
            draw_box(yrow, xcol, GRID_COLOR, GRID_THICKNESS)

    # draw next pieces border
    templates = [piece[0] for piece in PIECE_SHAPES.values()]
    pygame.draw.rect(SCREEN, BORDER_COLOR,
                     (X_MARGIN + (BOARD_WIDTH * BOX_SIZE) + BOX_SIZE,
                      Y_MARGIN - BORDER_THICKNESS,
                      (max([len(template[0]) for template in templates]) * BOX_SIZE) + 2 * BORDER_THICKNESS,
                      (max([len(template) for template in templates]) * BOX_SIZE) * 5 + 2 * BORDER_THICKNESS),
                     BORDER_THICKNESS)

    # draw hold piece border
    pygame.draw.rect(SCREEN, BORDER_COLOR,
                     (X_MARGIN - (max([len(template[0]) for template in
                                       templates]) + 1) * BOX_SIZE - 2 * BORDER_THICKNESS,
                      Y_MARGIN - BORDER_THICKNESS,
                      (max([len(template[0]) for template in templates]) * BOX_SIZE) + 2 * BORDER_THICKNESS,
                      (max([len(template) for template in templates]) * BOX_SIZE) + 2 * BORDER_THICKNESS),
                     BORDER_THICKNESS)


# draws a box given either a x,y within the playfield or the specified pixel x y coordinates
def draw_box(yrow, xcol, color, thickness, pixely=None, pixelx=None):
    if pixely is None and pixelx is None:
        pixely, pixelx = convert_to_pixel_coords(yrow, xcol)
    # thickness 0 = fill
    # thickness > 0 = border inside the rect
    # thickness < 0 = nothing
    pygame.draw.rect(SCREEN, color, (pixelx, pixely, BOX_SIZE, BOX_SIZE), thickness)


# draws the current playfield
def draw_board(board):
    for yrow in range(BOARD_HEIGHT - VISIBLE_BOARD_HEIGHT, BOARD_HEIGHT):
        for xcol in range(BOARD_WIDTH):
            if board[yrow][xcol] != BLANK:
                draw_box(yrow + VISIBLE_BOARD_HEIGHT - BOARD_HEIGHT, xcol, PIECE_COLORS[board[yrow][xcol]], 0)
                draw_box(yrow + VISIBLE_BOARD_HEIGHT - BOARD_HEIGHT, xcol, GRID_COLOR, GRID_THICKNESS)


# draws the next NUM_NEXT_PIECES pieces within its border
def draw_next_pieces(next_pieces):
    templates = [piece[0] for piece in PIECE_SHAPES.values()]
    for i in range(NUM_NEXT_PIECES):
        if next_pieces[i]['shape'] in ['L', 'J', 'S', 'Z', 'T']:
            pixelx = X_MARGIN + (BOARD_WIDTH + 1.5) * BOX_SIZE + BORDER_THICKNESS
            pixely = Y_MARGIN + 1 * BOX_SIZE + (max([len(template) for template in templates]) * BOX_SIZE) * i
        elif next_pieces[i]['shape'] == 'O':
            pixelx = X_MARGIN + (BOARD_WIDTH + 1) * BOX_SIZE + BORDER_THICKNESS
            pixely = Y_MARGIN + 1 * BOX_SIZE + (max([len(template) for template in templates]) * BOX_SIZE) * i
        else:
            pixelx = X_MARGIN + (BOARD_WIDTH + 1) * BOX_SIZE + BORDER_THICKNESS
            pixely = Y_MARGIN + 0.5 * BOX_SIZE + (max([len(template) for template in templates]) * BOX_SIZE) * i
        draw_piece(next_pieces[i], pixely, pixelx)


# draws the held piece within the held piece border
def draw_held_piece(piece):
    templates = [piece[0] for piece in PIECE_SHAPES.values()]
    if piece['shape'] in ['L', 'J', 'S', 'Z', 'T']:
        pixelx = X_MARGIN - (max([len(template[0]) for template in templates]) + 0.5) * BOX_SIZE - BORDER_THICKNESS
        pixely = Y_MARGIN + BOX_SIZE
    elif piece['shape'] == 'O':
        pixelx = X_MARGIN - (max([len(template[0]) for template in templates]) + 1) * BOX_SIZE - BORDER_THICKNESS
        pixely = Y_MARGIN + BOX_SIZE
    else:
        pixelx = X_MARGIN - (max([len(template[0]) for template in templates]) + 1) * BOX_SIZE - BORDER_THICKNESS
        pixely = Y_MARGIN + 0.5 * BOX_SIZE
    draw_piece(piece, pixely, pixelx)


# draws a piece given its x y or pixel x y positions
def draw_piece(piece, pixely=None, pixelx=None):
    template = PIECE_SHAPES[piece['shape']][piece['rotation']]
    if pixely is None and pixelx is None:
        for yrow in range(len(template)):
            for xcol in range(len(template[0])):
                if template[yrow][xcol] != BLANK:
                    if yrow + piece['y'] + VISIBLE_BOARD_HEIGHT - BOARD_HEIGHT >= 0:
                        draw_box(yrow + piece['y'] + VISIBLE_BOARD_HEIGHT - BOARD_HEIGHT,
                                 xcol + piece['x'], piece['color'], 0)
                        draw_box(yrow + piece['y'] + VISIBLE_BOARD_HEIGHT - BOARD_HEIGHT,
                                 xcol + piece['x'], GRID_COLOR, GRID_THICKNESS)
    else:
        for yrow in range(len(template)):
            for xcol in range(len(template[0])):
                if template[yrow][xcol] != BLANK:
                    draw_box(0, 0, piece['color'], 0, pixely + yrow * BOX_SIZE, pixelx + xcol * BOX_SIZE)
                    draw_box(0, 0, GRID_COLOR, GRID_THICKNESS, pixely + yrow * BOX_SIZE, pixelx + xcol * BOX_SIZE)


# draws the shadow of a piece where the piece would be harddropped to
def draw_piece_shadow(board, piece):
    for i in range(1, BOARD_HEIGHT):
        if not is_valid_position(board, piece, adjy=i):
            break
    shadow = {'shape': piece['shape'], 'rotation': piece['rotation'],
              'x': piece['x'], 'y': piece['y'] + i - 1, 'color': SHADOW_COLORS[piece['shape']]}
    shadow['color'] = shadow['color'].premul_alpha()
    draw_piece(shadow)


# converts the row, col of the board into pixel coordinates on the screen
def convert_to_pixel_coords(y, x):
    return Y_MARGIN + y * BOX_SIZE, X_MARGIN + x * BOX_SIZE


# prints the state of the board in the console
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


# prints the state of the board with a given piece in the console
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


# checks for the X button pressed in the pygame window
def check_for_quit():
    for event in pygame.event.get(QUIT):
        terminate()


# closes the pygame and running program
def terminate():
    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()
