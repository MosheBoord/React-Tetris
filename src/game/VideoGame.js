
export default class VideoGame {
    constructor() {
        this.frame = 1;
        this.loopCount = 0;
    }

    setFrameRate(rate) {
        this.frameRate = rate;
    }

    run() {
        this.gameLoop = setInterval(() => {
            this.loopCount++;
            if (this.loopCount / this.frame > this.frameRate) {
                this.runNextFrame();
            }
        }, 1)
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