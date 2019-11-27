
import VideoGame from "./VideoGame";
import TetrisPiece from "./TetrisPiece";
import KeyEvent from "./KeyEvent";

//the following is bad code, done quickly to get it working, but should be redone to have entire state change to update store.
import nextPieceDispatcher from "../store"

const PIECE_FALLING = "PIECE_FALLING";
const PIECE_ON_FLOOR = "PIECE_ON_FLOOR";

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
        this.level = 60;
        this.framesStalled = 0;
        this.rowsCompleted = [];
        this.clearedRows = 0;
        this.score = 0;
        this.downwardForce = 0;
        this.floorFrameLimit = 120;
        this.floorFrames = 0;
        this.standInPlaceLimit = 40;
        this.stoodInPlace = 0;
        this.phase = PIECE_FALLING;
        this.floorKicks = 0;
        this.floorKickLimit = 5;
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
        this.calculateKeyMovements();
        this.checkPhase();
        console.log(this.phase)

        switch (this.phase) {
            case PIECE_FALLING:
                this.calculateGravity();
                break;
            case PIECE_ON_FLOOR:
                this.floorFrames++;
                this.stoodInPlace++;
                if (this.floorFrames >= this.floorFrameLimit || this.stoodInPlace >= this.standInPlaceLimit) {
                    this.switchCurrentPiece();
                    this.floorFrames = 0;
                    this.phase = PIECE_FALLING;
                }
                break;
            default:
        }



        // this.floorFrames--;
        // if (!this.floorFrames) {
        //     this.switchCurrentPiece();
        // }

        // this.calculateKeyMovements();
        this.calculateCompletedRows();

        this.redrawState();
    }

    checkPhase() {
        const board = this.getGameState().physicalBoard;
        if (this.currentPiece.canMoveDown(board)) {
            this.phase = PIECE_FALLING;
            this.floorFrames = 0;
            this.floorPauseCounter = 0;
        } else {
            this.pieceLanded();
            this.phase = PIECE_ON_FLOOR;
        }
    }

    switchCurrentPiece() {
        this.drawToPhysicalBoard(this.currentPiece);
        this.score += this.level;
        this.store.dispatch({ type: "SCORE", score: this.score })
        this.currentPiece = this.nextPiece;
        this.ghostPiece = this.getNextPiece(this.currentPiece.type);
        this.pieces.push(this.currentPiece);
        this.nextPiece = this.getNextPiece();
        this.downwardForce = 0;
        this.checkForCompletedRows(this.currentPiece);
    }

    calculateKeyMovements() {
        const prevBoard = this.getGameState().physicalBoard;

        if (this.keysStatus.right && this.currentPiece && this.currentPiece.canMoveRight(prevBoard)) {
            this.currentPiece.x++;
            this.keysStatus.right--;
            this.stoodInPlace = 0;
        } else {
            this.keysStatus.right = 0;
        }

        if (this.keysStatus.left && this.currentPiece && this.currentPiece.canMoveLeft(prevBoard)) {
            this.currentPiece.x--;
            this.keysStatus.left--;
            this.stoodInPlace = 0;
        } else {
            this.keysStatus.left = 0;
        }

        if (this.keysStatus.down && this.currentPiece && this.currentPiece.canMoveDown(prevBoard)) {
            this.currentPiece.y++;
            this.keysStatus.down--;
            this.keysStatus.up = 0;
            //I don't think the next line is necessary
            this.stoodInPlace = 0;
        } else {
            this.keysStatus.down = 0;
        }

        if (this.keysStatus.up > 1 && this.currentPiece) {
            while (this.currentPiece.canMoveDown(prevBoard)) {
                this.currentPiece.y++;
            }
            this.keysStatus.up = 0;
            this.switchCurrentPiece();
            //I don't think the next line is necessary
            this.stoodInPlace = 0;
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
            this.stoodInPlace = 0;
        } else {
            this.keysStatus.rotateClockwise = 0;
        }

        if (this.keysStatus.rotateCounterClockwise && this.currentPiece && this.currentPiece.canRotateCounterClockwise(prevBoard)) {
            // if (this.gamepadConnected && this.rotateCounterClockwise > 1) {
            this.currentPiece.rotateCounterClockwise();
            this.keysStatus.rotateCounterClockwise = 0;
            // }
            this.stoodInPlace = 0;
        } else {
            this.keysStatus.rotateCounterClockwise = 0;
        }

        this.moveGhostPiece();
    }

    calculateGravity() {
        this.gravity = this.level * 1 / 600 + 1 / 60;
        this.downwardForce += this.gravity;
        // console.log(this.downwardForce)

        let wholeUnits = Math.floor(this.downwardForce);
        this.downwardForce -= wholeUnits;

        const prevBoard = this.getGameState().physicalBoard;

        // console.log(this.downwardForce)

        while (wholeUnits && this.currentPiece) {
            if (this.currentPiece.canMoveDown(prevBoard)) {
                wholeUnits--;
                this.currentPiece.y++;
            } else {
                wholeUnits = 0;
            }
        }
    }

    pieceLanded() {
        // this.currentPiece.supported = true;
        // this.drawToPhysicalBoard(this.currentPiece);
        if (this.currentPiece.y < -2) {
            this.stop();
        }
        // this.checkForCompletedRows(this.currentPiece);
        // this.floorFrames = 3 * (40 - this.level);
    }

    resetFloorPauseCounter() {
        this.floorPauseCounter = 0;
    }

    calculateCompletedRows() {
        if (this.rowsCompleted.length) {
            this.deleteRows();
            this.rowsCompleted = [];
        }
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
            this.ghostPiece.cells.forEach(cell => {
                const y = this.ghostPiece.y + cell.y;
                const x = this.ghostPiece.x + cell.x;
                if (y >= 0 && y <= 19 && x >= 0 && x <= 19 && board[y]) {
                    visualBoard[y][x] = cell;
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
        this.score += this.rowsCompleted.length * this.rowsCompleted.length * this.level * 50;
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