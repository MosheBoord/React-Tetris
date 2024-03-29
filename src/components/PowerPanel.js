import React from "react";
import { connect } from "react-redux";
import "../App.css";
import TetrisCell from "./TetrisCell";
import UpcomingTetrisPiece from "./UpcomingTetrisPiece";
import { Button, Progress } from "reactstrap";
import GarbageIcon from "./GarbageIcon";
import FlattenedRowPower from "./FlattenedRowPower";
import TwoPiecePower from "./TwoPiecePower";

const PowerPanel = props => {
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
                // border: "3px solid grey",
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
                // border: "3px solid grey",
                color: "white",
                width: "60%",
                height: "30%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                    Next Piece:
                </div>
                {/* <div style={{ border: "3px solid grey" }}> */}
                <UpcomingTetrisPiece nextPiece={props.nextPiece} />
                {/* </div> */}

            </div>
            <div style={{
                // border: "3px solid grey",
                color: "white",
                width: "60%",
                height: "30%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                    <FlattenedRowPower uses={props.flattenedPowerUses} />
                    <TwoPiecePower uses={props.twoPiecePowerUses} />
                </div>

            </div>
            <div style={{
                // border: "3px solid grey",
                color: "white",
                width: "40%",
                height: "20%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                </div>
                <GarbageIcon garbagePercentage={props.garbagePercentage} phase={props.phase} garbagePhase={props.garbagePhase} />
            </div>
            {/* <div style={{
                border: "3px solid grey",
                color: "white",
                width: "90%",
                height: "15%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                    Garbage:
                    <Progress animated color="danger" value={props.garbagePercentage} />
                </div>
            </div> */}
        </div>
    );
};

const mapStateToProps = state => ({
    nextPiece: state.nextPiece,
    score: state.score,
    rowsCleared: state.rowsCleared,
    phase: state.phase,
    garbagePercentage: state.garbagePercentage,
    flattenPercentage: state.flattenPercentage,
    wildPercentage: state.wildPercentage,
    flattenedPowerUses: state.flattenedPowerUses,
    twoPiecePowerUses: state.twoPiecePowerUses,
});

const connectedBoard = connect(mapStateToProps)(PowerPanel);

export default connectedBoard;