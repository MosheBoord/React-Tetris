
export default class TetrisPiece {
    constructor(config) {
        this.cells = [];
        this.x = 5;
        this.y = 5;
        if (config.type === TetrisPiece.RANDOM) {
            config.type = Math.floor(Math.random() * 7);
        }
        switch (config.type) {
            case TetrisPiece.I:
                this.cells[0] = { x: 1, y: 0, color: "blue", isEmpty: false }
                this.cells[1] = { x: 1, y: 1, color: "blue", isEmpty: false }
                this.cells[2] = { x: 1, y: 2, color: "blue", isEmpty: false }
                this.cells[3] = { x: 1, y: 3, color: "blue", isEmpty: false }
                break;
            case TetrisPiece.O:
                this.cells[0] = { x: 1, y: 1, color: "blue", isEmpty: false }
                this.cells[1] = { x: 1, y: 2, color: "blue", isEmpty: false }
                this.cells[2] = { x: 2, y: 1, color: "blue", isEmpty: false }
                this.cells[3] = { x: 2, y: 2, color: "blue", isEmpty: false }
                break;
            case TetrisPiece.J:
                this.cells[0] = { x: 2, y: 0, color: "blue", isEmpty: false }
                this.cells[1] = { x: 2, y: 1, color: "blue", isEmpty: false }
                this.cells[2] = { x: 2, y: 2, color: "blue", isEmpty: false }
                this.cells[3] = { x: 1, y: 2, color: "blue", isEmpty: false }
                break;
            case TetrisPiece.T:
                this.cells[0] = { x: 0, y: 1, color: "blue", isEmpty: false }
                this.cells[1] = { x: 1, y: 1, color: "blue", isEmpty: false }
                this.cells[2] = { x: 2, y: 1, color: "blue", isEmpty: false }
                this.cells[3] = { x: 1, y: 2, color: "blue", isEmpty: false }
                break;
            case TetrisPiece.L:
                this.cells[0] = { x: 1, y: 0, color: "blue", isEmpty: false }
                this.cells[1] = { x: 1, y: 1, color: "blue", isEmpty: false }
                this.cells[2] = { x: 1, y: 2, color: "blue", isEmpty: false }
                this.cells[3] = { x: 2, y: 2, color: "blue", isEmpty: false }
                break;
            case TetrisPiece.S:
                this.cells[0] = { x: 1, y: 1, color: "blue", isEmpty: false }
                this.cells[1] = { x: 2, y: 1, color: "blue", isEmpty: false }
                this.cells[2] = { x: 0, y: 2, color: "blue", isEmpty: false }
                this.cells[3] = { x: 1, y: 2, color: "blue", isEmpty: false }
                break;
            case TetrisPiece.Z:
                this.cells[0] = { x: 0, y: 1, color: "blue", isEmpty: false }
                this.cells[1] = { x: 1, y: 1, color: "blue", isEmpty: false }
                this.cells[2] = { x: 1, y: 2, color: "blue", isEmpty: false }
                this.cells[3] = { x: 2, y: 2, color: "blue", isEmpty: false }
                break;
            default:
        }
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