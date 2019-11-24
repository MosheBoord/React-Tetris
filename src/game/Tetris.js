
import VideoGame from "./VideoGame";
import TetrisPiece from "./TetrisPiece";
import KeyEvent from "./KeyEvent";

//the following is bad code, done quickly to get it working, but should be redone to have entire state change to update store.
import nextPieceDispatcher from "../store"

export default class Tetris extends VideoGame {
    constructor() {
        super();
        this.state = {
            tetrisBoard: this.getEmptyBoard(),
            physicalBoard: this.getEmptyBoard(),
            visualBoard: this.getEmptyBoard()
        };
        this.nextPiece = this.getNextPiece();
        this.currentPiece = this.getNextPiece();
        this.ghostPiece = this.getNextPiece(this.currentPiece.type);
        this.pieces = [this.currentPiece];
        this.keysStatus = { right: 0, left: 0, down: 0, up: 0, rotateClockwise: 0, rotateCounterClockwise: 0, };
        document.addEventListener("keydown", this.keyPressed.bind(this));
        this.level = 1;
        this.framesStalled = 0;
        this.rowsCompleted = [];
        this.clearedRows = 0;
        this.score = 0;
    }

    setKeyStatus(keyCode, boolean) {
        if (boolean) {
            this.keyPressed({ keyCode })
        }
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
            case KeyEvent.DOM_VK_UP:
                this.keysStatus.up++;
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
        this.store.dispatch({ type: "NEXT_PIECE", nextPiece: this.nextPiece });
        if (!this.rowsCompleted.length) {
            // this.removeVisualPiecesFromState();
            const prevBoard = this.getGameState().physicalBoard;
            if (this.framesStalled > 31 - this.level) {
                this.framesStalled = 0;
                if (this.currentPiece) {
                    if (this.currentPiece.canMoveDown(prevBoard)) {

                        this.currentPiece.y++;

                        this.calculateKeyMovements();
                    } else {
                        this.currentPiece.supported = true;
                        this.drawToPhysicalBoard(this.currentPiece);
                        if (this.currentPiece.y < -2) {
                            this.stop();
                        }
                        this.score += this.level;
                        this.store.dispatch({ type: "SCORE", score: this.score })
                        this.checkForCompletedRows(this.currentPiece);
                        console.log("what?")
                        this.currentPiece = null;
                        this.ghostPiece = null;
                    }
                    this.moveGhostPiece();
                } else {
                    this.currentPiece = this.nextPiece;
                    console.log("why?")
                    this.ghostPiece = this.getNextPiece(this.currentPiece.type);
                    this.pieces.push(this.currentPiece);
                    this.nextPiece = this.getNextPiece();
                    // this is not clean, need to rework system for easy state manipulation.

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
        const prevBoard = this.getGameState().physicalBoard;

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
            this.keysStatus.up = 0;
        } else {
            this.keysStatus.down = 0;
        }

        if (this.keysStatus.up > 1 && this.currentPiece) {
            while (this.currentPiece.canMoveDown(prevBoard)) {
                this.currentPiece.y++;

            }
        } else {
            if (this.keysStatus.up !== 1) {
                this.keysStatus.up = 0;
            }
        }

        // still need to check if rotation is legal

        // if (this.keysStatus.rotateClockwise && this.currentPiece && this.currentPiece.canRotateClockwise(prevBoard)) {
        if (this.keysStatus.rotateClockwise && this.currentPiece && this.currentPiece.canRotateClockwise(prevBoard)) {
            // if (this.gamepadConnected && this.rotateClockwise > 1) {
            this.currentPiece.rotateClockwise();
            this.keysStatus.rotateClockwise = 0;
            // }

        } else {
            this.keysStatus.rotateClockwise = 0;
        }

        if (this.keysStatus.rotateCounterClockwise && this.currentPiece && this.currentPiece.canRotateCounterClockwise(prevBoard)) {
            // if (this.gamepadConnected && this.rotateCounterClockwise > 1) {
            this.currentPiece.rotateCounterClockwise();
            this.keysStatus.rotateCounterClockwise = 0;
            // }
        } else {
            this.keysStatus.rotateCounterClockwise = 0;
        }

        this.moveGhostPiece();
    }

    drawToPhysicalBoard(piece) {
        const board = this.getGameState().physicalBoard;
        piece.cells.forEach(cell => {
            if (piece.y + cell.y > -1) {
                board[piece.y + cell.y][piece.x + cell.x] = cell;
            }
        });
    }

    redrawState() {
        // this.removeVisualPiecesFromState();
        const board = this.getEmptyBoard();
        // const oldBoard = this.getGameState().tetrisBoard;
        const physicalBoard = this.getGameState().physicalBoard;
        const visualBoard = this.getEmptyBoard();

        if (this.ghostPiece) {
            console.log("where?")
            this.ghostPiece.cells.forEach(cell => {
                const y = this.ghostPiece.y + cell.y;
                const x = this.ghostPiece.x + cell.x;
                if (y >= 0 && y <= 19 && x >= 0 && x <= 19 && board[y]) {
                    visualBoard[y][x] = cell;
                    console.log(visualBoard[y][x])
                }
            })
        }

        if (this.currentPiece) {
            this.currentPiece.cells.forEach(cell => {
                const y = this.currentPiece.y + cell.y;
                const x = this.currentPiece.x + cell.x;
                if (y >= 0 && y <= 19 && x >= 0 && x <= 19 && board[y]) {
                    visualBoard[y][x] = cell;
                }
            })
        }

        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                if (!physicalBoard[y][x].isEmpty) {
                    board[y][x] = physicalBoard[y][x];
                }

                if (!visualBoard[y][x].isEmpty) {
                    board[y][x] = visualBoard[y][x];
                }
            }
        }

        this.setGameState({ tetrisBoard: board });
    }

    getNextPiece(type = TetrisPiece.RANDOM) {
        const piece = new TetrisPiece({ type });
        return piece;
    }

    checkForCompletedRows(piece) {
        const board = this.getGameState().physicalBoard;
        for (let y = 0; y < 20; y++) {
            let rowIsFull = true;
            for (let x = 0; x < 10; x++) {
                if (board[y][x].isEmpty || board[y][x].ghostPiece) {
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
        const board = this.getGameState().physicalBoard;
        this.score += this.rowsCompleted.length * this.rowsCompleted.length * this.level;
        this.store.dispatch({ type: "SCORE", score: this.score })
        while (this.rowsCompleted.length) {
            board.splice(this.rowsCompleted.shift(), 1);
            this.clearedRows++;
            this.level++;
            this.store.dispatch({ type: "ROWS_CLEARED", rowsCleared: this.clearedRows })
            const row = [];
            for (let x = 0; x < 10; x++) {
                row.push({ isEmpty: true })
            }
            board.unshift(row);
        }
    }

    moveGhostPiece() {
        const prevBoard = this.getGameState().physicalBoard;
        if (this.ghostPiece) {
            this.ghostPiece.cells = [];
            this.ghostPiece.x = this.currentPiece.x;
            this.ghostPiece.y = this.currentPiece.y;
            this.currentPiece.cells.forEach(cell => {
                this.ghostPiece.cells.push({ x: cell.x, y: cell.y, ghostPiece: true, piece: this.ghostPiece, color: cell.color, isEmpty: false })
            })
            while (this.ghostPiece.canMoveDown(prevBoard)) {
                this.ghostPiece.y++;
            }
        }
    }
}