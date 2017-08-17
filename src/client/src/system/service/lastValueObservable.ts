import { Observable } from 'rxjs/Rx'

/**
 * Holds an observable stream and it's last value. Handy for querying in a procedural manor.
 */
export default class LastValueObservable<TLastValue> {
  _underlyingStream: Observable<TLastValue>

  constructor(stream: Observable<TLastValue>, latestValue: TLastValue) {
    this._latestValue = latestValue
    this._underlyingStream = stream
  }

  _latestValue: any

  get latestValue(): TLastValue {
    return this._latestValue
  }

  set latestValue(value: TLastValue) {
    this._latestValue = value
  }

  get stream(): Observable<TLastValue> {
    return this._underlyingStream
  }
}
