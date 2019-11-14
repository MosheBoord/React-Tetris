
import VideoGame from "./VideoGame";
import TetrisPiece from "./TetrisPiece";
import KeyEvent from "./KeyEvent";

export default class Tetris extends VideoGame {
    constructor() {
        super();
        this.state = this.getEmptyBoard();
        this.currentPiece = null;
        this.nextPiece = this.getNextPiece();
        this.currentPiece = this.getNextPiece();
        this.pieces = [this.currentPiece];
        this.keysStatus = { right: 0, left: 0 };
        document.addEventListener("keydown", this.keyPressed.bind(this));
        document.addEventListener("keyup", this.keyReleased.bind(this))
    }

    keyPressed(event) {
        switch (event.keyCode) {
            case KeyEvent.DOM_VK_RIGHT:
                this.keysStatus.right = 1;
                break;
            case KeyEvent.DOM_VK_LEFT:
                this.keysStatus.left = 1;
                break;
            default:
        }
    }

    keyReleased(event) {
        switch (event.keyCode) {
            case KeyEvent.DOM_VK_RIGHT:
                this.keysStatus.right = 0;
                break;
            case KeyEvent.DOM_VK_LEFT:
                this.keysStatus.left = 0;
                break;
            default:
        }
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
        let prevBoard = this.getGameState();
        if (this.currentPiece) {
            if (this.currentPiece.canMoveDown(prevBoard)) {
                this.currentPiece.y++;
                this.currentPiece.x += this.keysStatus.right - this.keysStatus.left;
            } else {
                this.currentPiece.supported = true;
                this.currentPiece = null;
            }
        } else {
            this.currentPiece = this.nextPiece;
            this.pieces.push(this.currentPiece);
            this.nextPiece = this.getNextPiece();
        }
        const board = this.getEmptyBoard();
        this.pieces.forEach(piece => {
            piece.cells.forEach(cell => {
                if (piece.y + cell.y >= 0) {
                    board[piece.y + cell.y][piece.x + cell.x] = cell;
                }
            })
        })
        this.setGameState(board);
    }

    getNextPiece() {
        const piece = new TetrisPiece({ type: TetrisPiece.RANDOM });

        return piece;
        // const piece = new TetrisPiece({ type: TetrisPiece.Z });
        // this.mapPieceToBoard(piece)
    }

    mapPieceToBoard(piece) {
        // const board = this.getEmptyBoard();
        const board = this.getEmptyBoard();
        const oldBoard = this.getGameState();

        // this keeps old board state
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                board[y][x] = oldBoard[y][x]
            }
        }

        // console.log(board)
        piece.cells.forEach(cell => {
            board[piece.y + cell.y][piece.x + cell.x] = cell;
        })
        this.setGameState(board);
    }
}