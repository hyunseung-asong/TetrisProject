export const
    LOCAL_MODEL_SAVE_PATH_ = '../../models/tetris-ai-v2.json',
    MODEL_SAVE_PATH_ = 'indexeddb://tetris-ai-v2.json',
    INDEXEDDB_MODEL_SAVE_PATH_ = 'indexeddb://tetris-ai-v2.json',
    ACTION_COST = 1,
    EXTRANEOUS_ACTION_COST = 10,
    NUM_INPUTS = 6,
    // weights are from https://codemyroad.wordpress.com/2013/04/14/tetris-ai-the-near-perfect-player/
    BUMPINESS_WEIGHT = -0.184483,
    HOLES_WEIGHT = -0.35663,
    HEIGHT_WEIGHT = -0.2,
    SCORE_WEIGHT = 0.760666 / 10.0 // some bs number. WE SHOULD USE GENETIC ALGORITHM TO CALCULATE THIS VALUE FOR OUR OWN PROGRAM
    ;