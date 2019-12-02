import React from "react";
import { connect } from "react-redux";
import "../App.css";
import TetrisCell from "./TetrisCell";
import UpcomingTetrisPiece from "./UpcomingTetrisPiece";
import { Button, Progress } from "reactstrap";

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
            border: "3px solid grey",
            margin: "10px",
            background: "black",
        }}>
            <div style={{
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
            </div>
            <div style={{
                border: "3px solid grey",
                color: "white",
                width: "90%",
                height: "15%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                    Flatten:
                    <Progress animated value={props.garbagePercentage} />
                </div>
            </div>
            <div style={{
                border: "3px solid grey",
                color: "white",
                width: "90%",
                height: "15%",
                textAlign: "center",
                margin: "5px"
            }}>
                <div style={{ margin: "10px" }}>
                    Wild:
                    <Progress animated color="success" value={props.garbagePercentage} />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    garbagePhase: state.garbagePhase,
    garbagePercentage: state.garbagePercentage,
    flattenPercentage: state.flattenPercentage,
    wildPercentage: state.wildPercentage,
});

const connectedBoard = connect(mapStateToProps)(PowerPanel);

export default connectedBoard;