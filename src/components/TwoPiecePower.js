import React from "react";
import { connect } from "react-redux";
import "../App.css";
import twoPieceIndicator from "../images/Two piece indicator.png";
import twoPieceIndicatorGreyedOut from "../images/Two piece indicator greyed out.png";

const TwoPiecePower = props => {

    const src = props.uses ? twoPieceIndicator : twoPieceIndicatorGreyedOut;

    return (
        // <div>
        <div style={{
            margin: "20%"
        }}>
            <img src={src} style={{
                width: "25%",
                height: "25%",
            }} />  X {props.uses}
        </div>
    );
}

export default TwoPiecePower;