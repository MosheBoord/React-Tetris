import React from "react";
import { connect } from "react-redux";
import "../App.css";
import TetrisCell from "./TetrisCell";
import UpcomingTetrisPiece from "./UpcomingTetrisPiece";

const OptionsPanel = props => {
    let board = props.board ? props.board : [];
    return (
        <div style={{
            width: "300px",
            height: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "3px solid grey",
            margin: "10px",
            background: "black",
        }}>
            <div style={{
                border: "3px solid grey",
                color: "white",
                width: "60%",
                height: "15%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                    Score: {props.score}
                </div>

                <div style={{ margin: "10px" }}>
                    Rows Cleared: {props.rowsCleared}
                </div>
            </div>
            <div style={{
                border: "3px solid grey",
                color: "white",
                width: "60%",
                height: "30%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                    Next Piece
                </div>
                <UpcomingTetrisPiece nextPiece={props.nextPiece} />
            </div>
            <div style={{
                border: "3px solid grey",
                color: "white",
                width: "60%",
                height: "40%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                    Controls:

                    Use the arrow keys to move the piece. The up key will instantly drop the piece.

                    Use the Z and X keys to rotate the piece.
                </div>
                <div style={{ margin: "10px" }}>
                    Goal: Clear as many rows as possible by filling them up.
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    nextPiece: state.nextPiece,
    rowsCleared: state.rowsCleared,
    score: state.score,
    frame: state.frame
});

const connectedBoard = connect(mapStateToProps)(OptionsPanel);

export default connectedBoard;