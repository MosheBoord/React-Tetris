import React from "react";
import { connect } from "react-redux";
import "../App.css";
import TetrisCell from "./TetrisCell";
import UpcomingTetrisPiece from "./UpcomingTetrisPiece";
import { Button, Progress } from "reactstrap";

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
            border: "3px solid blue",
            margin: "10px",
            background: "black",
        }}>
            <div style={{
                // border: "3px solid blue",
                color: "white",
                width: "80%",
                height: "80%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                    Controls:

                    Use the arrow keys to move the piece. The up key will instantly drop the piece.

                    Use the A and D keys to rotate the piece.

                    Use the W key to activate your Rainbow Row ability.

                    Use the S key to activate your Smooth Fill In ablility.

                    Use the Space key to swap the current piece with the upcoming piece.
                </div>
                <div style={{ margin: "10px" }}>
                    Goal: Clear as many rows as possible by filling them up.
                </div>
                <br></br>
                <div style={{ margin: "10px" }}>
                    <Button onClick={props.reset}>Reset</Button>
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