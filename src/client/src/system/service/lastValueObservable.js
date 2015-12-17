/**
 * Holds an observable stream and it's last value. Handy for querying in a procedural manor.
 */
export default class LastValueObservable<TLastValue> {
    _latestValue:TLastValue;

    constructor(stream, latestValue:TLastValue) {
        this._latestValue = latestValue;
        this._underlyingStream = stream;
    }

    get latestValue() {
        return this._latestValue;
    }

    set latestValue(value) {
        this._latestValue = value;
    }

    get stream() {
        return this._underlyingStream;
    }
}
