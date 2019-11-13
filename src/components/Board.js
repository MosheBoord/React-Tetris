import React from "react";
import { connect } from "react-redux";
import "../App.css";
import TetrisCell from "./TetrisCell";

const Board = props => {
    let board = props.board ? props.board : [];
    return (
        <div style={{
            width: "300px",
            height: "600px",
            display: "flex",
            flexWrap: "wrap",
            border: "3px solid grey",
            margin: "10px",
            background: "black",
        }}>
            {board.map(row => {
                return (
                    <>
                        {row.map(cell => {
                            return (
                                <div style={{ width: "10%", height: "5%" }}>
                                    <TetrisCell cell={cell} />
                                </div>
                            )
                        })}
                    </>
                )
            })}
        </div>
    );
};

const mapStateToProps = state => ({
    board: state.tetrisBoard,
    frame: state.frame
});

const connectedBoard = connect(mapStateToProps)(Board);

export default connectedBoard;