
import VideoGame from "./VideoGame";
import TetrisPiece from "./TetrisPiece";

export default class Tetris extends VideoGame {
    constructor() {
        super();
        this.state = this.getEmptyBoard();
        this.currentPiece = null;
        this.nextPiece = this.getNextPiece();
    }

    getEmptyBoard() {
        const tetrisBoard = [];
        for (let y = 0; y < 20; y++) {
            let row = [];
            for (let x = 0; x < 10; x++) {
                row.push({ x, y, isEmpty: true });
            }
            tetrisBoard.push(row);
        }
        return tetrisBoard;
    }

    runNextFrame() {
        if (this.currentPiece) {

        } else {
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.getNextPiece();
        }
    }

    getNextPiece() {
        const piece = new TetrisPiece({ type: TetrisPiece.RANDOM });
        // const piece = new TetrisPiece({ type: TetrisPiece.Z });
        this.mapPieceToBoard(piece)
    }

    mapPieceToBoard(piece) {
        const board = this.getEmptyBoard();
        piece.cells.forEach(cell => {
            board[piece.y + cell.y][piece.x + cell.x] = cell;
        })
        this.setGameState(board);
    }
}