export default class LastValueObservable {
    constructor(stream, latestValue) {
        this.latestValue = latestValue;
        this._underlyingStream = stream;
    }
    subscribe(observer) {
        return this._underlyingStream.subscribe(observer);
    }
}
