
import VideoGame from "./VideoGame";
import TetrisPiece from "./TetrisPiece";
import KeyEvent from "./KeyEvent";

//the following is bad code, done quickly to get it working, but should be redone to have entire state change to update store.
import nextPieceDispatcher from "../store"

// LIST OF PHASES
const PIECE_FALLING = "PIECE_FALLING";
const PIECE_ON_FLOOR = "PIECE_ON_FLOOR";
const GARBAGE = "GARBAGE";
const GAME_OVER = "GAME_OVER";
const RAINBOW = "RAINBOW";


export default class Tetris extends VideoGame {
    constructor() {
        super();
        this.state = {
            tetrisBoard: this.getEmptyBoard(),
            physicalBoard: this.getEmptyBoard(),
            visualBoard: this.getEmptyBoard(),
            garbagePercent: 0,
        };
        this.nextPiece = this.getNextPiece();
        this.currentPiece = this.getNextPiece();
        this.ghostPiece = this.getNextPiece(this.currentPiece.type);
        this.pieces = [this.currentPiece];
        this.keysStatus = {
            right: 0,
            left: 0,
            down: 0,
            up: 0,
            rotateClockwise: 0,
            rotateCounterClockwise: 0,
            getTwoPiece: 0,
            flattenRow: 0,
            swapWithNextPiece: 0,
        };
        document.addEventListener("keydown", this.keyPressed.bind(this));
        this.level = 1;
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
        this.garbagePoints = 0;
        this.garbagePointLimit = 25;
        this.timeInAir = 0;
        this.twoPieceMicroPoints = 0;
        this.twoPieceUseges = 0;
        this.flattenRowPoints = 0;
        this.flattenRowUseges = 0;
        this.rainbowPieces = null;
        this.rainbowLandedFrames = 0;
        this.rainbowThreshold = 7;

        this.gameOverCells = [];
        const gameOverGrid = setUpGameOverCells();
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                this.gameOverCells.push(gameOverGrid[y][x]);
            }
        }
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
            case KeyEvent.DOM_VK_A:
                this.keysStatus.rotateCounterClockwise++;
                break;
            case KeyEvent.DOM_VK_D:
                this.keysStatus.rotateClockwise++;
                break;
            case KeyEvent.DOM_VK_S:
                this.keysStatus.getTwoPiece++;
                break;
            case KeyEvent.DOM_VK_W:
                this.keysStatus.flattenRow++;
                break;
            case KeyEvent.DOM_VK_SPACE:
                this.keysStatus.swapWithNextPiece++;
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
        // console.log("hello")
        this.store.dispatch({ type: "NEXT_PIECE", nextPiece: this.nextPiece });
        if (this.phase !== GARBAGE && this.phase !== RAINBOW) {
            this.calculateKeyMovements();
        }
        this.checkPhase();

        switch (this.phase) {
            case PIECE_FALLING:
                this.calculateGravity();
                this.timeInAir++;
                break;
            case PIECE_ON_FLOOR:
                this.floorFrames++;
                this.stoodInPlace++;
                if (this.floorFrames >= this.floorFrameLimit || this.stoodInPlace >= this.standInPlaceLimit) {
                    this.switchCurrentPiece();
                    this.floorFrames = 0;
                    if (this.phase !== GARBAGE) {
                        this.phase = PIECE_FALLING;
                    }
                }
                break;
            case GARBAGE:
                this.calculateGravity();
                break;
            case GAME_OVER:
                if (this.gameOverCells.length) {
                    const cell = this.gameOverCells.pop();
                    this.getGameState().physicalBoard[cell.y][cell.x] = cell;
                }
                if (this.gameOverCells.length) {
                    const cell = this.gameOverCells.pop();
                    this.getGameState().physicalBoard[cell.y][cell.x] = cell;
                }
                if (this.gameOverCells.length) {
                    const cell = this.gameOverCells.pop();
                    this.getGameState().physicalBoard[cell.y][cell.x] = cell;
                }
                break;
            case RAINBOW:
                if (this.rainbowPieces.length) {
                    this.runRainbowMovements();
                } else {
                    this.rainbowLandedFrames++;
                    if (this.rainbowLandedFrames === 10) {
                        this.rainbowLandedFrames = 0;
                        this.checkForCompletedRows();
                        this.switchCurrentPiece();
                        this.phase = PIECE_FALLING;
                        this.rainbowPieces = null;
                    }
                }
                break;
            default:
        }

        this.setGameState({
            phase: this.phase,
            twoPiecePowerUses: this.twoPieceUseges,
            flattenedPowerUses: this.flattenRowUseges
        });
        this.calculateCompletedRows();
        this.redrawState();
    }

    checkPhase() {
        if (this.phase === GAME_OVER || this.phase === RAINBOW) {
            return;
        }

        const board = this.getGameState().physicalBoard;
        if (this.currentPiece.canMoveDown(board)) {
            if (this.phase !== GARBAGE) {
                this.phase = PIECE_FALLING;
                this.floorFrames = 0;
                this.floorPauseCounter = 0;
            }
        } else {
            if (this.phase === GARBAGE) {
                this.pieceLanded();
                // if (this.phase !== GAME_OVER) {
                this.switchCurrentPiece();
                // }
            } else {
                this.phase = PIECE_ON_FLOOR;
                this.pieceLanded();
            }
        }
    }

    switchCurrentPiece() {
        if (this.phase === GAME_OVER) {
            return;
        }
        if (this.phase !== RAINBOW) {
            this.pieceLanded();
        }
        if (this.phase === GAME_OVER) {
            return;
        }
        const prevBoard = this.getGameState().physicalBoard;
        if (this.phase !== RAINBOW) {
            this.drawToPhysicalBoard(this.currentPiece);
        }
        if (this.phase === GARBAGE) {
            this.garbagePoints = 0;
            this.phase = PIECE_FALLING;
            this.timeInAir = 0;
        } else {
            this.score += this.level;
            this.store.dispatch({ type: "SCORE", score: this.score })
            this.garbagePoints++;
            // console.log((this.garbagePoints / (this.garbagePointLimit - 1) * 100));
            this.setGameState({ garbagePercentage: (this.garbagePoints / (this.garbagePointLimit - 1) * 100) });
        }


        if (this.garbagePoints >= this.garbagePointLimit) {
            this.currentPiece = this.getNextPiece();
            this.currentPiece.setColor(TetrisPiece.Black);
            this.currentPiece.x = Math.floor(Math.random() * 10 - 1);
            while (!this.currentPiece.hasLegalPlacement(prevBoard)) {
                this.currentPiece.x = Math.floor(Math.random() * 10 - 1);
            }
            this.ghostPiece = null;
            this.garbagePoints = 0;
            this.setGarbageLimit();
            this.setGameState({ garbagePercentage: 0 });
            this.phase = GARBAGE;
        } else {
            if (this.timeInAir < 250) {
                this.twoPieceMicroPoints += 250 - this.timeInAir;
                // this.setGameState({ garbagePercentage: this.twoPieceMicroPoints / 60 });
                if (this.twoPieceMicroPoints >= 6000) {
                    this.twoPieceMicroPoints -= 6000;
                    this.twoPieceUseges++;
                }
            }
            this.timeInAir = 0;
            this.currentPiece = this.nextPiece;
            this.ghostPiece = this.getNextPiece(this.currentPiece.type);
            this.pieces.push(this.currentPiece);
            this.nextPiece = this.getNextPiece();
            this.downwardForce = 0;
            this.floorKicks = 0;
        }

        this.checkForCompletedRows(this.currentPiece);

    }

    calculateKeyMovements() {
        if (this.phase === GAME_OVER) {
            return;
        }

        const prevBoard = this.getGameState().physicalBoard;

        if (this.keysStatus.right && this.currentPiece) {
            if (this.currentPiece.canMoveRight(prevBoard)) {
                this.currentPiece.x++;
                this.keysStatus.right--;
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canMoveRight(prevBoard, 0, -1) && this.floorKicks <= this.floorKickLimit) {
                this.floorKicks++;
                this.currentPiece.y--;
                this.currentPiece.x++;
                this.keysStatus.right--;
                this.stoodInPlace = 0;
            } else {
                this.keysStatus.right = 0;
            }
        } else {
            this.keysStatus.right = 0;
        }

        if (this.keysStatus.left && this.currentPiece) {
            if (this.currentPiece.canMoveLeft(prevBoard)) {
                this.currentPiece.x--;
                this.keysStatus.left--;
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canMoveLeft(prevBoard, 0, -1) && this.floorKicks <= this.floorKickLimit) {
                this.floorKicks++;
                this.currentPiece.y--;
                this.currentPiece.x--;
                this.keysStatus.left--;
                this.stoodInPlace = 0;
            } else {
                this.keysStatus.left = 0;
            }
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
        if (this.keysStatus.rotateClockwise && this.currentPiece) {
            if (this.currentPiece.canRotateClockwise(prevBoard)) {
                this.currentPiece.rotateClockwise();
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateClockwise(prevBoard, 0, -1)) {
                this.currentPiece.rotateClockwise(0, -1);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateClockwise(prevBoard, -1, 0)) {
                this.currentPiece.rotateClockwise(-1, 0);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateClockwise(prevBoard, 1, 0)) {
                this.currentPiece.rotateClockwise(1, 0);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateClockwise(prevBoard, 0, -2)) {
                this.currentPiece.rotateClockwise(0, -2);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateClockwise(prevBoard, -2, 0)) {
                this.currentPiece.rotateClockwise(-2, 0);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateClockwise(prevBoard, 2, 0)) {
                this.currentPiece.rotateClockwise(2, 0);
                this.stoodInPlace = 0;
            }
            this.keysStatus.rotateClockwise = 0;
        } else {
            this.keysStatus.rotateClockwise = 0;
        }

        if (this.keysStatus.rotateCounterClockwise && this.currentPiece) {
            if (this.currentPiece.canRotateCounterClockwise(prevBoard)) {
                this.currentPiece.rotateCounterClockwise();
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateCounterClockwise(prevBoard, 0, -1)) {
                this.currentPiece.rotateCounterClockwise(0, -1);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateCounterClockwise(prevBoard, -1, 0)) {
                this.currentPiece.rotateCounterClockwise(-1, 0);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateCounterClockwise(prevBoard, 1, 0)) {
                this.currentPiece.rotateCounterClockwise(1, 0);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateCounterClockwise(prevBoard, 0, -2)) {
                this.currentPiece.rotateCounterClockwise(0, -2);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateCounterClockwise(prevBoard, -2, 0)) {
                this.currentPiece.rotateCounterClockwise(-2, 0);
                this.stoodInPlace = 0;
            } else if (this.currentPiece.canRotateCounterClockwise(prevBoard, 2, 0)) {
                this.currentPiece.rotateCounterClockwise(2, 0);
                this.stoodInPlace = 0;
            }
            // if (this.gamepadConnected && this.rotateCounterClockwise > 1) {
            // this.currentPiece.rotateCounterClockwise();
            // this.keysStatus.rotateCounterClockwise = 0;
            // }
            this.keysStatus.rotateCounterClockwise = 0;
        } else {
            this.keysStatus.rotateCounterClockwise = 0;
        }

        if (this.keysStatus.swapWithNextPiece && this.currentPiece) {
            if (this.nextPiece.canSwap(prevBoard, this.currentPiece.x, this.currentPiece.y)) {
                this.swapPieces();
            } else if (this.nextPiece.canSwap(prevBoard, this.currentPiece.x, this.currentPiece.y - 1)) {
                this.swapPieces(0, -1);
            } else if (this.nextPiece.canSwap(prevBoard, this.currentPiece.x + 1, this.currentPiece.y)) {
                this.swapPieces(1, 0);
            } else if (this.nextPiece.canSwap(prevBoard, this.currentPiece.x - 1, this.currentPiece.y)) {
                this.swapPieces(-1, 0);
            } else if (this.nextPiece.canSwap(prevBoard, this.currentPiece.x, this.currentPiece.y - 1)) {
                this.swapPieces(0, -2);
            }
            // this.swapPieces();
            this.keysStatus.swapWithNextPiece = 0;
        } else {
            this.keysStatus.swapWithNextPiece = 0;
        }

        if (this.keysStatus.getTwoPiece && this.twoPieceUseges && this.currentPiece.type !== TetrisPiece.TWO) {
            const oldX = this.currentPiece.x;
            const oldY = this.currentPiece.y;
            this.currentPiece = this.getNextPiece(TetrisPiece.TWO);
            this.currentPiece.x = oldX;
            this.currentPiece.y = oldY;
            this.ghostPiece = this.getNextPiece(TetrisPiece.TWO);
            this.keysStatus.getTwoPiece = 0;
            this.twoPieceUseges--;
        } else {
            this.keysStatus.getTwoPiece = 0;
        }

        if (this.keysStatus.flattenRow && this.flattenRowUseges) {
            // this.currentPiece = this.getNextPiece(TetrisPiece.ROW);
            this.currentPiece = null;
            this.ghostPiece = null;
            this.rainbowPieces = [];
            for (let i = 0; i < 10; i++) {
                this.rainbowPieces.push(this.getNextPiece(TetrisPiece.RAINBOW_PIECE));
                this.rainbowPieces[i].x = i;
            }
            this.phase = RAINBOW;
            this.flattenRowUseges--;
            this.keysStatus.flattenRow = 0;
        } else {
            this.keysStatus.flattenRow = 0;
        }

        this.moveGhostPiece();
    }

    swapPieces(xModifier = 0, yModifier = 0) {
        const oldX = this.currentPiece.x;
        const oldY = this.currentPiece.y;
        this.currentPiece.x = this.nextPiece.x;
        this.currentPiece.y = this.nextPiece.y;
        const oldPieceType = this.currentPiece.type;
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.getNextPiece(oldPieceType);
        this.currentPiece.x = oldX + xModifier;
        this.currentPiece.y = oldY + yModifier;
        this.ghostPiece = this.getNextPiece(this.currentPiece.type);
        this.moveGhostPiece();
    }

    calculateGravity() {

        if (this.phase === PIECE_FALLING) {
            this.gravity = this.level * 1 / 600 + 1 / 60;
        } else {
            this.gravity = .25;
        }

        // this.gravity = 0;

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
            // this.stop();
            this.phase = GAME_OVER;
            this.setGameState({ garbagePercentage: 0 });
            // this.gameOverCells.sort(() => Math.round(Math.random));
            this.shuffle(this.gameOverCells);
            this.ghostPiece = null;
            this.currentPiece = null;
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

        if (this.rainbowPieces) {
            this.rainbowPieces.forEach(piece => {
                const y = piece.y;
                const x = piece.x;
                if (y >= 0 && y <= 19 && x >= 0 && x <= 19 && board[y]) {
                    visualBoard[y][x] = piece.cells[0];
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

        this.flattenRowPoints += (this.rowsCompleted.length * 2) - 1
        while (this.flattenRowPoints >= this.rainbowThreshold) {
            this.flattenRowUseges++;
            this.flattenRowPoints -= this.rainbowThreshold;
            this.rainbowThreshold += 5;
            // here we need to dispatch the uses
        }

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

    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    runRainbowMovements() {
        this.gravity = .2;
        this.downwardForce += this.gravity;
        const prevBoard = this.getGameState().physicalBoard;
        for (let i = 0; i < this.rainbowPieces.length; i++) {
            let wholeUnits = Math.floor(this.downwardForce);
            while (this.rainbowPieces[i].canMoveDown(prevBoard) && wholeUnits) {
                this.rainbowPieces[i].y++;
                wholeUnits--;
            }
            if (wholeUnits) {
                let yLocation = this.rainbowPieces[i].y;
                for (let y = 19; y > this.rainbowPieces[i].y; y--) {
                    if (this.getGameState().physicalBoard[y][this.rainbowPieces[i].x].isEmpty) {
                        if (y === 19 || !this.getGameState().physicalBoard[y + 1][this.rainbowPieces[i].x].isEmpty) {
                            yLocation = y;
                        }
                    }
                }
                this.getGameState().physicalBoard[yLocation][this.rainbowPieces[i].x] = this.rainbowPieces[i].cells[0];
                this.rainbowPieces[i] = null;
            }
        }
        this.rainbowPieces = this.rainbowPieces.filter(piece => piece);

        let wholeUnits = Math.floor(this.downwardForce);
        this.downwardForce -= wholeUnits;
    }

    setGarbageLimit() {
        if (this.level > 300) {
            this.garbagePointLimit = 3;
        } else if (this.level > 250) {
            this.garbagePointLimit = 4;
        } else if (this.level > 215) {
            this.garbagePointLimit = 5;
        } else if (this.level > 185) {
            this.garbagePointLimit = 6;
        } else if (this.level > 165) {
            this.garbagePointLimit = 7;
        } else if (this.level > 150) {
            this.garbagePointLimit = 8;
        } else if (this.level > 140) {
            this.garbagePointLimit = 9;
        } else if (this.garbagePointLimit > 10) {
            this.garbagePointLimit--;
        }
    }
}

function setUpGameOverCells() {
    const gameOverBoard = [];
    for (let y = 0; y < 20; y++) {
        let row = [];
        for (let x = 0; x < 10; x++) {
            row.push({ x, y, isEmpty: false, color: TetrisPiece.Red });
        }
        gameOverBoard.push(row);
    }

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 10; x++) {
            gameOverBoard[y][x].isEmpty = true;
        }
    }

    gameOverBoard[1][1].isEmpty = false;
    gameOverBoard[1][1].color = TetrisPiece.TextG;
    gameOverBoard[1][2].isEmpty = false;
    gameOverBoard[1][2].color = TetrisPiece.TextA;
    gameOverBoard[1][3].isEmpty = false;
    gameOverBoard[1][3].color = TetrisPiece.TextM;
    gameOverBoard[1][4].isEmpty = false;
    gameOverBoard[1][4].color = TetrisPiece.TextE;
    gameOverBoard[1][5].isEmpty = false;
    gameOverBoard[1][5].color = TetrisPiece.TextO;
    gameOverBoard[1][6].isEmpty = false;
    gameOverBoard[1][6].color = TetrisPiece.TextV;
    gameOverBoard[1][7].isEmpty = false;
    gameOverBoard[1][7].color = TetrisPiece.TextE;
    gameOverBoard[1][8].isEmpty = false;
    gameOverBoard[1][8].color = TetrisPiece.TextR;

    gameOverBoard[3][0].isEmpty = true;
    gameOverBoard[3][1].isEmpty = true;
    gameOverBoard[3][2].isEmpty = true;
    gameOverBoard[3][7].isEmpty = true;
    gameOverBoard[3][8].isEmpty = true;
    gameOverBoard[3][9].isEmpty = true;

    gameOverBoard[4][0].isEmpty = true;
    gameOverBoard[4][9].isEmpty = true;

    // gameOverBoard[5][0].isEmpty = true;
    // gameOverBoard[5][9].isEmpty = true;

    gameOverBoard[6][2].isEmpty = true;
    gameOverBoard[6][3].isEmpty = true;
    gameOverBoard[6][6].isEmpty = true;
    gameOverBoard[6][7].isEmpty = true;

    gameOverBoard[7][2].isEmpty = true;
    gameOverBoard[7][3].isEmpty = true;
    gameOverBoard[7][6].isEmpty = true;
    gameOverBoard[7][7].isEmpty = true;

    gameOverBoard[9][4].isEmpty = true;
    gameOverBoard[9][5].isEmpty = true;

    gameOverBoard[10][0].isEmpty = true;
    gameOverBoard[10][9].isEmpty = true;

    gameOverBoard[11][0].isEmpty = true;
    gameOverBoard[11][1].isEmpty = true;
    gameOverBoard[11][2].isEmpty = true;
    gameOverBoard[11][4].isEmpty = true;
    gameOverBoard[11][5].isEmpty = true;
    gameOverBoard[11][7].isEmpty = true;
    gameOverBoard[11][8].isEmpty = true;
    gameOverBoard[11][9].isEmpty = true;

    gameOverBoard[12][0].isEmpty = true;
    gameOverBoard[12][2].isEmpty = true;
    gameOverBoard[12][4].isEmpty = true;
    gameOverBoard[12][5].isEmpty = true;
    gameOverBoard[12][7].isEmpty = true;
    gameOverBoard[12][9].isEmpty = true;

    gameOverBoard[13][0].isEmpty = true;
    gameOverBoard[13][2].isEmpty = true;
    gameOverBoard[13][3].isEmpty = true;
    gameOverBoard[13][4].isEmpty = true;
    gameOverBoard[13][5].isEmpty = true;
    gameOverBoard[13][6].isEmpty = true;
    gameOverBoard[13][7].isEmpty = true;
    gameOverBoard[13][9].isEmpty = true;

    gameOverBoard[14][0].isEmpty = true;
    gameOverBoard[14][3].isEmpty = true;
    gameOverBoard[14][6].isEmpty = true;
    gameOverBoard[14][9].isEmpty = true;

    gameOverBoard[15][0].isEmpty = true;
    gameOverBoard[15][1].isEmpty = true;
    gameOverBoard[15][8].isEmpty = true;
    gameOverBoard[15][9].isEmpty = true;

    gameOverBoard[16][0].isEmpty = true;
    gameOverBoard[16][1].isEmpty = true;
    gameOverBoard[16][2].isEmpty = true;
    gameOverBoard[16][7].isEmpty = true;
    gameOverBoard[16][8].isEmpty = true;
    gameOverBoard[16][9].isEmpty = true;

    for (let y = 17; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
            gameOverBoard[y][x].isEmpty = true;
        }
    }

    return gameOverBoard;
}