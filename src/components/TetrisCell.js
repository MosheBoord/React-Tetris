import React from "react";
import { connect } from "react-redux";
import "../App.css";
import blankCell from "../images/tetris blank 1.png";
import tetrisCellBase from "../images/tetris cell base.png";
import tetrisCellBlue from "../images/tetris cell blue.png";

const TetrisCell = props => {
    const { cell } = props;
    if (cell.isEmpty) {
        // return <img style={{ width: "100%", height: "100%" }} src={blankCell} ></img >
        // return <div style={{ width: "100%", height: "100%", background: "black" }} />
        return null
    } else {
        // return <div style={{ width: "100%", height: "100%", background: cell.color }} />
        return (
            <div>
                {/* <div style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", position: "absolute", zIndex: 2, background: cell.color, opacity: "50%" }} /> */}
                <img style={{ width: "100%", height: "100%" }} src={tetrisCellBlue} />
                {/* <img style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }} src={tetrisCellBase} /> */}
            </div>
        )
    }
}

export default TetrisCell;