import React from "react";
import { connect } from "react-redux";
import "../App.css";
import garbageIcon from "../images/Garbage.png";

const GARBAGE = "GARBAGE";

const GarbageIcon = props => {

    if (props.phase === GARBAGE) {
        return (
            <img style={{
                width: "60%",
                height: "60%",
            }} src={garbageIcon} />
        )
    } else if (props.garbagePercentage >= 100) {
        return (
            <img style={{
                width: "60%",
                height: "60%",
                animationDuration: ".35s",
                animationName: "garbageApearence",
                animationDirection: "alternate",
                animationIterationCount: "infinite",
            }} src={garbageIcon} />
        )
    } else {
        return null;
    }

}

export default GarbageIcon;