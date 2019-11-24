
export default class TetrisPiece {
    constructor(config) {
        this.cells = [];
        // this.x = Math.floor(Math.random() * 6) + 1;//5;
        // this.y = Math.floor(Math.random() * 16) + 1;//5;
        this.x = 4;
        this.y = -3;
        // this.y = 5;

        this.length = 3;
        if (config.type === TetrisPiece.RANDOM) {
            config.type = Math.floor(Math.random() * 7);
        }
        switch (config.type) {
            case TetrisPiece.I:
                this.cells[0] = { x: 1, y: 0, color: TetrisPiece.Blue, isEmpty: false }
                this.cells[1] = { x: 1, y: 1, color: TetrisPiece.Blue, isEmpty: false }
                this.cells[2] = { x: 1, y: 2, color: TetrisPiece.Blue, isEmpty: false }
                this.cells[3] = { x: 1, y: 3, color: TetrisPiece.Blue, isEmpty: false }
                this.y = -4;
                this.length = 4;
                break;
            case TetrisPiece.O:
                this.cells[0] = { x: 1, y: 1, color: TetrisPiece.Yellow, isEmpty: false }
                this.cells[1] = { x: 1, y: 2, color: TetrisPiece.Yellow, isEmpty: false }
                this.cells[2] = { x: 2, y: 1, color: TetrisPiece.Yellow, isEmpty: false }
                this.cells[3] = { x: 2, y: 2, color: TetrisPiece.Yellow, isEmpty: false }
                this.length = 4;
                break;
            case TetrisPiece.J:
                this.cells[0] = { x: 1, y: 0, color: TetrisPiece.Purple, isEmpty: false }
                this.cells[1] = { x: 1, y: 1, color: TetrisPiece.Purple, isEmpty: false }
                this.cells[2] = { x: 1, y: 2, color: TetrisPiece.Purple, isEmpty: false }
                this.cells[3] = { x: 0, y: 2, color: TetrisPiece.Purple, isEmpty: false }
                break;
            case TetrisPiece.T:
                this.cells[0] = { x: 0, y: 1, color: TetrisPiece.Orange, isEmpty: false }
                this.cells[1] = { x: 1, y: 1, color: TetrisPiece.Orange, isEmpty: false }
                this.cells[2] = { x: 2, y: 1, color: TetrisPiece.Orange, isEmpty: false }
                this.cells[3] = { x: 1, y: 2, color: TetrisPiece.Orange, isEmpty: false }
                break;
            case TetrisPiece.L:
                this.cells[0] = { x: 1, y: 0, color: TetrisPiece.Green, isEmpty: false }
                this.cells[1] = { x: 1, y: 1, color: TetrisPiece.Green, isEmpty: false }
                this.cells[2] = { x: 1, y: 2, color: TetrisPiece.Green, isEmpty: false }
                this.cells[3] = { x: 2, y: 2, color: TetrisPiece.Green, isEmpty: false }
                break;
            case TetrisPiece.S:
                this.cells[0] = { x: 1, y: 0, color: TetrisPiece.LightBlue, isEmpty: false }
                this.cells[1] = { x: 2, y: 0, color: TetrisPiece.LightBlue, isEmpty: false }
                this.cells[2] = { x: 0, y: 1, color: TetrisPiece.LightBlue, isEmpty: false }
                this.cells[3] = { x: 1, y: 1, color: TetrisPiece.LightBlue, isEmpty: false }
                break;
            case TetrisPiece.Z:
                this.cells[0] = { x: 0, y: 0, color: TetrisPiece.Red, isEmpty: false }
                this.cells[1] = { x: 1, y: 0, color: TetrisPiece.Red, isEmpty: false }
                this.cells[2] = { x: 1, y: 1, color: TetrisPiece.Red, isEmpty: false }
                this.cells[3] = { x: 2, y: 1, color: TetrisPiece.Red, isEmpty: false }
                break;
            default:
        }
        this.cells.forEach(cell => {
            cell.piece = this;
        })
        this.type = config.type;
    }

    canMoveDown(board) {
        let flag = true;
        this.cells.forEach(cell => {
            try {
                const y = this.y + cell.y;
                const x = this.x + cell.x;
                if (this.y + cell.y > 18) {
                    flag = false;
                } else if (!board[y + 1][x].isEmpty && board[y + 1][x].piece !== this) {
                    flag = false;
                }
            } catch (error) {

            }
        })
        return flag;
    }

    canMoveRight(board) {
        let flag = true;
        this.cells.forEach(cell => {
            try {
                const y = this.y + cell.y;
                const x = this.x + cell.x;
                if (x > 8) {
                    flag = false;
                } else if (!board[y][x + 1].isEmpty && board[y][x + 1].piece !== this) {
                    flag = false;
                }
            } catch (error) {

            }
        })
        return flag;
    }

    canMoveLeft(board) {
        let flag = true;
        this.cells.forEach(cell => {
            try {
                const y = this.y + cell.y;
                const x = this.x + cell.x;
                if (x < 1) {
                    flag = false;
                } else if (!board[y][x - 1].isEmpty && board[y][x - 1].piece !== this) {
                    flag = false;
                }
            } catch (error) {

            }
        })
        return flag;
    }

    canRotateClockwise(board) {
        let flag = true;
        this.cells.forEach(cell => {
            try {
                const y = cell.x + this.y;
                const x = (this.length - 1) - cell.y + this.x;
                // console.log(board)
                if (!board[y] || !board[y][x] || (!board[y][x].isEmpty && board[y][x].piece !== this)) {
                    flag = false;
                }
            } catch (error) {

            }
        })
        return flag;
    }

    canRotateCounterClockwise(board) {
        let flag = true;
        this.cells.forEach(cell => {
            try {
                const y = (this.length - 1) - cell.x + this.y;
                const x = cell.y + this.x;
                if (!board[y] || !board[y][x] || (!board[y][x].isEmpty && board[y][x].piece !== this)) {
                    flag = false;
                }
            } catch (error) {

            }
        })
        return flag;
    }

    removeCell(cellToBeRemoved) {
        this.cells.forEach((cell, index) => {
            if (cellToBeRemoved === cell) {
                this.cells.splice(index, 1);
            }
        })
    }

    rotateClockwise() {
        this.cells.forEach(cell => {
            const x = cell.x;
            const y = cell.y;
            cell.x = (this.length - 1) - y;
            cell.y = x;
        })
    }

    rotateCounterClockwise() {
        this.cells.forEach(cell => {
            const x = cell.x;
            const y = cell.y;
            cell.x = y;
            cell.y = (this.length - 1) - x;
        })
    }
}

TetrisPiece.RANDOM = "RANDOM";
TetrisPiece.I = 0;
TetrisPiece.O = 1;
TetrisPiece.J = 2;
TetrisPiece.L = 3;
TetrisPiece.T = 4;
TetrisPiece.S = 5;
TetrisPiece.Z = 6;

TetrisPiece.Blue = 0;
TetrisPiece.LightBlue = 1;
TetrisPiece.Red = 2;
TetrisPiece.Yellow = 3;
TetrisPiece.Green = 4;
TetrisPiece.Purple = 5;
TetrisPiece.Orange = 6;

TetrisPiece.MAPPEDCLOCKWISEROTATIONS = {
    "00": { x: 3, y: 0 }, "10": { x: 3, y: 1 }, "20": { x: 3, y: 2 }, "30": { x: 3, y: 3 },
    "01": { x: 2, y: 0 }, "11": { x: 2, y: 1 }, "21": { x: 2, y: 2 }, "31": { x: 2, y: 3 },
    "02": { x: 1, y: 0 }, "12": { x: 1, y: 1 }, "22": { x: 1, y: 2 }, "32": { x: 1, y: 3 },
    "03": { x: 0, y: 0 }, "13": { x: 0, y: 1 }, "23": { x: 0, y: 2 }, "33": { x: 0, y: 3 },
}
