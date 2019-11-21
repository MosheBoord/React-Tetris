
export default class VideoGame {
    constructor() {
        this.frame = 1;
        this.loopCount = 0;
    }

    setFrameRate(rate) {
        this.frameRate = rate;
    }

    run() {
        const main = tFrame => {
            this.stopMain = window.requestAnimationFrame(main);
            this.runNextFrame(tFrame);
        }

        main(); // Start the cycle
        const gameEngine = this;

        // window.addEventListener("gamepadconnected", function (e) {
        //     this.gamepadConnected = true;
        //     setInterval(() => {
        //         const gp = navigator.getGamepads()[0];
        //         gp.buttons.forEach((button, index) => {
        //             if (button.pressed) {
        //                 this.gamePads[0].buttons[index].holdTime++;
        //                 if (this.gamePads[0].buttons[index].holdTime > this.gamePads[0].buttons[index].heldTimeThreshold) {
        //                     this.KeyPressed({keyCode: })
        //                 }
        //             }
        //         })
        //     }, 1)
        // });
    }

    setKeyStatus(keyCode, boolean) {

    }

    stop() {
        clearInterval(this.gameLoop);
        window.cancelAnimationFrame(this.stopMain);
    }

    runNextFrame() {

    }

    setGameState(state) {
        state.keys().forEach(key => {
            this.state[key] = state[key];
            if (this.store && this.dispatcher) {
                this.store.dispatch(this.dispatcher[key](state[key]));
            }
        })
    }

    getGameState() {
        return this.state;
    }

    subscribeToGameState(store, dispatcher) {
        this.store = store;
        this.dispatcher = dispatcher;
    }
}