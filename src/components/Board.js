import React from "react";
import { connect } from "react-redux";
import "../App.css";
import TetrisCell from "./TetrisCell";
import PreLoadImages from "./PreLoadImages";

const Board = props => {
    let board = props.board ? props.board : [];
    return (
        <div style={{
            width: "300px",
            height: "600px",
            display: "flex",
            flexWrap: "wrap",
            border: "3px solid blue",
            margin: "10px",
            background: "black",
        }}>
            <iframe style={{ visibility: "hidden", display: "none" }} width="640" height="480" src="https://www.youtube.com/embed/9Fv5cuYZFC0?start=1&autoplay=1"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
            <PreLoadImages />
            {board.map((row, yIndex) => {
                return (
                    <>
                        {row.map((cell, xIndex) => {
                            return (
                                <div style={{ width: "10%", height: "5%" }}>
                                    {/* as of now, the next line does not need the distance prop */}
                                    <TetrisCell cell={cell} distance={Math.floor(Math.getDistance(10, 20, xIndex, yIndex))} />
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

Math.getDistance = function (x1, y1, x2, y2) {

    var xs = x2 - x1,
        ys = y2 - y1;

    xs *= xs;
    ys *= ys;

    return Math.sqrt(xs + ys);
};