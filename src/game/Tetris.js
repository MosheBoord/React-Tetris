
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
        this.level = 1;
        this.framesStalled = 0;
        this.rowsCompleted = [];
        this.clearedRows = 0;
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
        if (!this.rowsCompleted.length) {
            const prevBoard = this.getGameState();
            if (this.framesStalled > 31 - this.level) {
                this.framesStalled = 0;
                if (this.currentPiece) {
                    if (this.currentPiece.canMoveDown(prevBoard)) {

                        this.currentPiece.y++;

                        this.calculateKeyMovements();
                    } else {
                        this.currentPiece.supported = true;
                        this.checkForCompletedRows(this.currentPiece);
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
        } else {
            this.deleteRows();
            this.rowsCompleted = [];
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

        // still need to check if rotation is legal

        // if (this.keysStatus.rotateClockwise && this.currentPiece && this.currentPiece.canRotateClockwise(prevBoard)) {
        if (this.keysStatus.rotateClockwise && this.currentPiece) {//&& this.currentPiece.canRotateClockwise(prevBoard)) {
            this.currentPiece.rotateClockwise();
            this.keysStatus.rotateClockwise--;
        } else {
            this.keysStatus.rotateClockwise = 0;
        }

        if (this.keysStatus.rotateCounterClockwise && this.currentPiece) {//&& this.currentPiece.canRotateCounterClockwise(prevBoard)) {
            this.currentPiece.rotateCounterClockwise();
            this.keysStatus.rotateCounterClockwise--;
        } else {
            this.keysStatus.rotateCounterClockwise = 0;
        }
    }

    removeCurrentPieceFromState() {
        const board = this.getGameState();
        if (this.currentPiece) {
            for (let y = 0; y < 20; y++) {
                for (let x = 0; x < 10; x++) {
                    if (board[y][x].piece === this.currentPiece) {
                        board[y][x] = { x, y, isEmpty: true };
                    }
                }
            }
        }
    }

    redrawState() {
        this.removeCurrentPieceFromState();
        const board = this.getEmptyBoard();
        const oldBoard = this.getGameState();
        // this.pieces.forEach(piece => {
        //     piece.cells.forEach(cell => {
        //         const y = piece.y + cell.y;
        //         const x = piece.x + cell.x;
        //         if (y >= 0 && y <= 19 && x >= 0 && x <= 19 && board[y]) {
        //             board[y][x] = cell;
        //         }
        //     })
        // })
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                board[y][x] = oldBoard[y][x]
            }
        }

        if (this.currentPiece) {
            this.currentPiece.cells.forEach(cell => {
                const y = this.currentPiece.y + cell.y;
                const x = this.currentPiece.x + cell.x;
                if (y >= 0 && y <= 19 && x >= 0 && x <= 19 && board[y]) {
                    board[y][x] = cell;
                }
            })
        }

        this.setGameState(board);
    }

    getNextPiece() {
        const piece = new TetrisPiece({ type: TetrisPiece.RANDOM });

        return piece;
        // const piece = new TetrisPiece({ type: TetrisPiece.Z });
        // this.mapPieceToBoard(piece)
    }

    checkForCompletedRows(piece) {
        const board = this.getGameState();
        // piece.cells.forEach(cell => {
        //     if (!this.rowsCompleted.includes(piece.y + cell.y) && board[piece.y + cell.y]) {
        //         if (!board[piece.y + cell.y].filter(boardCell => boardCell.isEmpty).length) {
        //             this.rowsCompleted.push(piece.y + cell.y);
        //         }
        //     }
        // })
        // this.rowsCompleted.sort((a, b) => a < b);
        for (let y = 0; y < 20; y++) {
            let rowIsFull = true;
            for (let x = 0; x < 10; x++) {
                if (board[y][x].isEmpty) {
                    rowIsFull = false;
                    break;
                }
            }
            if (rowIsFull) {
                this.rowsCompleted.push(y);
            }
        }
    }

    deleteRows() {
        const board = this.getGameState();
        while (this.rowsCompleted.length) {
            // board.splice(this.rowsCompleted.shift() - removed, 1);
            board.splice(this.rowsCompleted.shift(), 1);
            this.clearedRows++;
            this.level++;
            const row = [];
            for (let x = 0; x < 10; x++) {
                row.push({ isEmpty: true })
            }
            board.unshift(row);
        }

        // for (let y = 0; y < 20; y++) {
        //     if (this.rowsCompleted.includes(board[y])) {
        //         board.splice(y, 1);
        //         const row = [];
        //         for (let x = 0; x < 10; x++) {
        //             row.push({ isEmpty: true })
        //         }
        //         board.unshift(row);
        //     }
        // }
        // this.rowsCompleted.forEach(row => {
        //     board.splice(row,)
        //     // board[row].forEach(cell => {
        //     //     cell.piece.removeCell(cell);
        //     // })
        // })
    }
}