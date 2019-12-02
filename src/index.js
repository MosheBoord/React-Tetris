import "./index.css";
import * as serviceWorker from "./serviceWorker";
import React from "react";
import ReactDOM from "react-dom";
import Board from "./components/Board";
import OptionsPanel from "./components/OptionsPanel"
import PowerPanel from "./components/PowerPanel"
import { Provider } from "react-redux";
import store, { boardUpdate, getGarbagePercentage } from "./store";
import "./App.css";
import Tetris from "./game/Tetris";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    (
        <Provider store={store}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <OptionsPanel />
                <Board />
                <PowerPanel />
            </div>
        </Provider >
    )
    , document.getElementById("root")
);

const tetris = new Tetris();
tetris.subscribeToGameState(store, {
    tetrisBoard: boardUpdate,
    garbagePercentage: getGarbagePercentage
})

tetris.setFrameRate(1000 / 1);

tetris.run();

// tetris.runNextFrame();

// setInterval(() => tetris.runNextFrame(), 100);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
