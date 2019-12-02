import React from "react";
import { connect } from "react-redux";
import "../App.css";

import IPiece from "../images/tetris I piece.png";
import OPiece from "../images/tetris O piece.png";
import JPiece from "../images/tetris J piece.png";
import TPiece from "../images/tetris T piece.png";
import LPiece from "../images/tetris L piece.png";
import ZPiece from "../images/tetris Z piece.png";
import SPiece from "../images/tetris S piece.png";
import TWOPiece from "../images/tetris TWO piece.png";

import TetrisPiece from "../game/TetrisPiece";
import TetrisCell from "./TetrisCell";

const UpcomingTetrisPiece = props => {
    let src;
    switch (props.nextPiece.type) {
        case TetrisPiece.I:
            src = IPiece;
            break;
        case TetrisPiece.O:
            src = OPiece;
            break;
        case TetrisPiece.J:
            src = JPiece;
            break;
        case TetrisPiece.L:
            src = LPiece;
            break;
        case TetrisPiece.T:
            src = TPiece;
            break;
        case TetrisPiece.Z:
            src = ZPiece;
            break;
        case TetrisPiece.S:
            src = SPiece;
            break;
        case TetrisPiece.TWO:
            src = TWOPiece;
            break;
        default:
    }

    return (
        <img style={{ width: "60%", height: "60%" }} src={src} />
    )
}

export default UpcomingTetrisPiece;