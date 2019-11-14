
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
        this.keysStatus = { right: 0, left: 0, down: 0, rotateClockwise: 0, rotateCounterClockwise: 0 };
        document.addEventListener("keydown", this.keyPressed.bind(this));
        this.level = 10;
        this.framesStalled = 0;
    }

    keyPressed(event) {
        switch (event.keyCode) {
            case KeyEvent.DOM_VK_RIGHT:
                this.keysStatus.right++;
                break;
            case KeyEvent.DOM_VK_LEFT:
                this.keysStatus.left++;
                break;
            case KeyEvent.DOM_VK_DOWN:
                this.keysStatus.down++;
                break;
            case KeyEvent.DOM_VK_X:
                this.keysStatus.rotateClockwise++;
                break;
            case KeyEvent.DOM_VK_Z:
                this.keysStatus.rotateCounterClockwise++;
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
        const prevBoard = this.getGameState();
        if (this.framesStalled > 31 - this.level) {
            this.framesStalled = 0;
            if (this.currentPiece) {
                if (this.currentPiece.canMoveDown(prevBoard)) {
                    this.currentPiece.y++;
                    this.calculateKeyMovements();
                } else {
                    this.currentPiece.supported = true;
                    this.currentPiece = null;
                }
            } else {
                this.currentPiece = this.nextPiece;
                this.pieces.push(this.currentPiece);
                this.nextPiece = this.getNextPiece();
            }
            this.redrawState();
        } else {
            this.framesStalled++;
            this.calculateKeyMovements();
            this.redrawState();
        }
    }

    calculateKeyMovements() {
        const prevBoard = this.getGameState();

        if (this.keysStatus.right && this.currentPiece && this.currentPiece.canMoveRight(prevBoard)) {
            this.currentPiece.x++;
            this.keysStatus.right--;
        } else {
            this.keysStatus.right = 0;
        }

        if (this.keysStatus.left && this.currentPiece && this.currentPiece.canMoveLeft(prevBoard)) {
            this.currentPiece.x--;
            this.keysStatus.left--;
        } else {
            this.keysStatus.left = 0;
        }

        if (this.keysStatus.down && this.currentPiece && this.currentPiece.canMoveDown(prevBoard)) {
            this.currentPiece.y++;
            this.keysStatus.down--;
        } else {
            this.keysStatus.down = 0;
        }

        // if (this.keysStatus.rotateClockwise && this.currentPiece && this.currentPiece.canRotateClockwise(prevBoard)) {
        if (this.keysStatus.rotateClockwise) {
            this.currentPiece.rotateClockwise();
            this.keysStatus.rotateClockwise--;
        } else {
            this.keysStatus.rotateClockwise = 0;
        }

        if (this.keysStatus.rotateCounterClockwise) {
            this.currentPiece.rotateCounterClockwise();
            this.keysStatus.rotateCounterClockwise--;
        } else {
            this.keysStatus.rotateCounterClockwise = 0;
        }
    }

    redrawState() {
        const board = this.getEmptyBoard();
        this.pieces.forEach(piece => {
            piece.cells.forEach(cell => {
                const y = piece.y + cell.y;
                const x = piece.x + cell.x;
                if (y >= 0 && y <= 19 && x >= 0 && x <= 19 && board[y]) {
                    board[y][x] = cell;
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

    // mapPieceToBoard(piece) {
    //     // const board = this.getEmptyBoard();
    //     const board = this.getEmptyBoard();
    //     const oldBoard = this.getGameState();

    //     // this keeps old board state
    //     for (let y = 0; y < 20; y++) {
    //         for (let x = 0; x < 10; x++) {
    //             board[y][x] = oldBoard[y][x]
    //         }
    //     }

    //     // console.log(board)
    //     piece.cells.forEach(cell => {
    //         board[piece.y + cell.y][piece.x + cell.x] = cell;
    //     })
    //     this.setGameState(board);
    // }
}