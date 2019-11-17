import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";

import TetrisPiece from "./game/TetrisPiece";

const logger = createLogger({
    predicate: (getState, action) => {
        // Use the next line to disable specific actions from being logged.
        // return ![ACTION_TYPE_ONE, ACTION_TYPE_TWO, ...].includes(action.type);
        return ![BOARD_UPDATE, SCORE, NEXT_PIECE].includes(action.type);

        // Return false if you don't want to log anything.
        // return false;
    }
});

//ACTION TYPES

// This action takes place whenever the game decides to update the board.
const BOARD_UPDATE = "BOARD_UPDATE";

const NEXT_PIECE = "NEXT_PIECE";

const ROWS_CLEARED = "ROWS_CLEARED";

const SCORE = "SCORE";

//ACTION CREATORS

export const boardUpdate = (tetrisBoard) => ({
    type: BOARD_UPDATE,
    tetrisBoard,
});

export const nextPieceDispatcher = (nextPiece) => ({
    type: NEXT_PIECE,
    nextPiece
})

// setting up an initial chessboard state
const tetrisBoard = [];
for (let y = 0; y < 20; y++) {
    let row = [];
    for (let x = 0; x < 10; x++) {
        row.push({ x, y, color: (x + y) % 2 ? "blue" : "blue", isEmpty: true });
    }
    tetrisBoard.push(row);
}

// tetrisBoard[4][5].isEmpty = false;
// tetrisBoard[4][6].isEmpty = false;
// tetrisBoard[5][5].isEmpty = false;
// tetrisBoard[3][6].isEmpty = false;
// tetrisBoard[12][6].isEmpty = false;

// setting up initial redux state
const initialState = {
    tetrisBoard,
    nextPiece: { type: TetrisPiece.I, cells: [] },
    score: 0,
    rowsCleared: 0,
};



// all actions go through this reducer
const reducer = (prevState = initialState, action) => {
    switch (action.type) {
        case BOARD_UPDATE:
            return {
                ...prevState,
                tetrisBoard: action.tetrisBoard,
            };
        case NEXT_PIECE:
            return {
                ...prevState,
                nextPiece: action.nextPiece,
            };
        case ROWS_CLEARED:
            return {
                ...prevState,
                rowsCleared: action.rowsCleared,
            };
        case SCORE:
            return {
                ...prevState,
                score: action.score,
            };
        default:
            return prevState;
    }
};

const store = createStore(reducer, applyMiddleware(logger));

// console.log("Hello")

// setInterval(() => {
//     console.log("Hello")
//     for (let y = 20; y > 0; y++) {
//         for (let x = 10; x > 0; x++) {
//             if (tetrisBoard[y] && !tetrisBoard[y][x].isEmpty) {
//                 tetrisBoard[y + 1][x].isEmpty = false;
//                 tetrisBoard[y][x].isEmpty = true;
//             }
//         }
//     }
//     store.dispatch(boardUpdate(tetrisBoard))
// }, 1000)

export default store;
