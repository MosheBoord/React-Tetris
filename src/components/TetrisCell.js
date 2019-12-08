import React from "react";
import { connect } from "react-redux";
import "../App.css";
import blankCell from "../images/tetris blank 1.png";
// import tetrisCellBase from "../images/tetris cell base.png";

import tetrisCellBlue from "../images/tetris cell blue.png";
import tetrisCellLightBlue from "../images/tetris cell light blue.png";
import tetrisCellRed from "../images/tetris cell red.png";
import tetrisCellYellow from "../images/tetris cell yellow.png";
import tetrisCellGreen from "../images/tetris cell green.png";
import tetrisCellPurple from "../images/tetris cell purple.png";
import tetrisCellOrange from "../images/tetris cell orange.png";
import tetrisCellBlack from "../images/tetris cell black.png";
import tetrisCellWhite from "../images/tetris cell white.png";
import tetrisCellRainbow from "../images/tetris cell rainbow.png";
import tetrisCellG from "../images/tetris cell G.png";
import tetrisCellA from "../images/tetris cell A.png";
import tetrisCellM from "../images/tetris cell M.png";
import tetrisCellE from "../images/tetris cell E.png";
import tetrisCellO from "../images/tetris cell O.png";
import tetrisCellV from "../images/tetris cell V.png";
import tetrisCellR from "../images/tetris cell R.png";

import tetrisCellBlueGhost from "../images/tetris cell blue ghost.png";
import tetrisCellLightBlueGhost from "../images/tetris cell light blue ghost.png";
import tetrisCellRedGhost from "../images/tetris cell red ghost.png";
import tetrisCellYellowGhost from "../images/tetris cell yellow ghost.png";
import tetrisCellGreenGhost from "../images/tetris cell green ghost.png";
import tetrisCellPurpleGhost from "../images/tetris cell purple ghost.png";
import tetrisCellOrangeGhost from "../images/tetris cell orange ghost.png";
import tetrisCellWhiteGhost from "../images/tetris cell white ghost.png";

import TetrisPiece from "../game/TetrisPiece";
import { LightingSource } from "./Shaders";

const TetrisCell = props => {
    const { cell } = props;
    if (cell.isEmpty) {
        // return <img style={{ width: "100%", height: "100%" }} src={blankCell} ></img >
        return null
    } else {
        // return <div style={{ width: "100%", height: "100%", background: cell.color }} />
        let src;
        if (cell.ghostPiece) {
            switch (cell.color) {
                case TetrisPiece.Blue:
                    src = tetrisCellBlueGhost;
                    break;
                case TetrisPiece.LightBlue:
                    src = tetrisCellLightBlueGhost;
                    break;
                case TetrisPiece.Red:
                    src = tetrisCellRedGhost;
                    break;
                case TetrisPiece.Yellow:
                    src = tetrisCellYellowGhost;
                    break;
                case TetrisPiece.Green:
                    src = tetrisCellGreenGhost;
                    break;
                case TetrisPiece.Purple:
                    src = tetrisCellPurpleGhost;
                    break;
                case TetrisPiece.Orange:
                    src = tetrisCellOrangeGhost;
                    break;
                case TetrisPiece.White:
                    src = tetrisCellWhiteGhost;
                    break;
                default:
            }
        } else {
            switch (cell.color) {
                case TetrisPiece.Blue:
                    src = tetrisCellBlue;
                    break;
                case TetrisPiece.LightBlue:
                    src = tetrisCellLightBlue;
                    break;
                case TetrisPiece.Red:
                    src = tetrisCellRed;
                    break;
                case TetrisPiece.Yellow:
                    src = tetrisCellYellow;
                    break;
                case TetrisPiece.Green:
                    src = tetrisCellGreen;
                    break;
                case TetrisPiece.Purple:
                    src = tetrisCellPurple;
                    break;
                case TetrisPiece.Orange:
                    src = tetrisCellOrange;
                    break;
                case TetrisPiece.Black:
                    src = tetrisCellBlack;
                    break;
                case TetrisPiece.White:
                    src = tetrisCellWhite;
                    break;
                case TetrisPiece.Rainbow:
                    src = tetrisCellRainbow;
                    break;
                case TetrisPiece.TextG:
                    src = tetrisCellG;
                    break;
                case TetrisPiece.TextA:
                    src = tetrisCellA;
                    break;
                case TetrisPiece.TextM:
                    src = tetrisCellM;
                    break;
                case TetrisPiece.TextE:
                    src = tetrisCellE;
                    break;
                case TetrisPiece.TextO:
                    src = tetrisCellO;
                    break;
                case TetrisPiece.TextV:
                    src = tetrisCellV;
                    break;
                case TetrisPiece.TextR:
                    src = tetrisCellR;
                    break;
                default:
            }
        }

        return (
            <>
                {/* <div style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", position: "absolute", zIndex: 2, background: cell.color, opacity: "50%" }} /> */}
                <img style={{ width: "100%", height: "100%" }} src={src} />
                {/* <img style={{ width: "100%", height: "100%" }} src={src} /> */}
                {/* <LightingSource
                    style={{
                        // display: "block",
                    }}
                    imgSrc={src} distance={props.distance}></LightingSource> */}
                {/* <img style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }} src={tetrisCellBase} /> */}
            </>
        )
    }
}

export default TetrisCell;