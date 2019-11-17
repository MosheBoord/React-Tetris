import KeyEvent from "./KeyEvent";

export default class VideoGame {
    constructor() {
        this.frame = 1;
        this.loopCount = 0;
    }

    setFrameRate(rate) {
        this.frameRate = rate;
        // console.log(this.frameRate)
    }

    run() {
        // const startTime = Date.now();
        // let currentTime;
        // this.gameLoop = setInterval(() => {
        //     currentTime = Date.now();
        //     // this.loopCount++;
        //     // if (this.loopCount / this.frame > this.frameRate) {
        //     if (currentTime - startTime / this.frame > this.frameRate / 1000) {
        //         this.runNextFrame();
        //         this.frame++;
        //         console.log(currentTime - startTime / this.frame);
        //     }
        // }, 1)
        const main = tFrame => {
            this.stopMain = window.requestAnimationFrame(main);

            this.runNextFrame(tFrame); // Call your update method. In our case, we give it rAF's timestamp.
            // render();
        }

        main(); // Start the cycle
        let gameEngine = this;

        // The following code should not remain in the final version of VieoGame
        // It is only here for Tetris.

        window.addEventListener("gamepadconnected", function (e) {
            this.gamepadConnected = true;
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);
            setInterval(() => {
                // if (e.gamepad.) 
                // var event = Window.trigger('keypress', { which: 'A'.charCodeAt(0) });
                // event.which = KeyEvent; // Character 'A'

                let gp = navigator.getGamepads()[0];

                if (gp.buttons[4].pressed) {
                    gameEngine.setKeyStatus(KeyEvent.DOM_VK_Z, true);
                }

                if (gp.buttons[5].pressed) {
                    gameEngine.setKeyStatus(KeyEvent.DOM_VK_X, true);
                }

                if (gp.buttons[12].pressed) {
                    gameEngine.setKeyStatus(KeyEvent.DOM_VK_UP, true);
                }

                if (gp.buttons[13].pressed) {
                    gameEngine.setKeyStatus(KeyEvent.DOM_VK_DOWN, true);
                }

                if (gp.buttons[14].pressed) {
                    gameEngine.setKeyStatus(KeyEvent.DOM_VK_LEFT, true);
                }

                if (gp.buttons[15].pressed) {
                    gameEngine.setKeyStatus(KeyEvent.DOM_VK_RIGHT, true);
                }

                gp.buttons.forEach((button, index) => {
                    if (button.pressed) {
                        console.log(index)
                    }
                })


            }, 100)
        });
    }

    setKeyStatus(keyCode, boolean) {

    }

    pause() {

    }

    resume() {

    }

    stop() {
        clearInterval(this.gameLoop);
        window.cancelAnimationFrame(this.stopMain);
    }

    runNextFrame() {

    }

    setGameState(state) {
        this.state = state;
        if (this.store && this.dispatcher) {
            this.store.dispatch(this.dispatcher(state));
        }
    }

    getGameState() {
        return this.state;
    }

    subscribeToGameState(store, dispatcher) {
        this.store = store;
        this.dispatcher = dispatcher;
    }
}