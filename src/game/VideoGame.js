
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
    }

    pause() {

    }

    resume() {

    }

    stop() {
        clearInterval(this.gameLoop);
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