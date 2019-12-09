import React from "react";
import { connect } from "react-redux";
import "../App.css";
import rainBowIndicator from "../images/Rainbow indicator.png";
import rainBowIndicatorGreyedOut from "../images/Rainbow indicator greyed out.png";



const FlattenedRowPower = props => {

    const src = props.uses ? rainBowIndicator : rainBowIndicatorGreyedOut;

    return (
        <div style={{
            margin: "20%"
        }}>
            <img src={src} style={{
                width: "40%",
                height: "40%",
            }} />  X {props.uses}
        </div >
    )
}

export default FlattenedRowPower;