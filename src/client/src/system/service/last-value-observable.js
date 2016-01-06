import Rx from 'rx';

/**
 * Holds an observable stream and it's last value. Handy for querying in a procedural manor.
 */
export default class LastValueObservable<TLastValue> {
  _underlyingStream:Rx.Observable<TLastValue>;
  _latestValue:TLastValue;

  constructor(stream:Rx.Observable<TLastValue>, latestValue:TLastValue) {
    this._latestValue = latestValue;
    this._underlyingStream = stream;
  }

  get latestValue():TLastValue {
    return this._latestValue;
  }

  set latestValue(value:TLastValue) {
    this._latestValue = value;
  }

  get stream():Rx.Observable<TLastValue> {
    return this._underlyingStream;
  }
}
