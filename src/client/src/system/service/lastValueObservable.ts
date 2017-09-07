import { Observable } from 'rxjs/Rx'

/**
 * Holds an observable stream and it's last value. Handy for querying in a procedural manor.
 */
export default class LastValueObservable<TLastValue> {
  underlyingStream: Observable<TLastValue>
  latestValue: TLastValue

  constructor(stream: Observable<TLastValue>, latestValue: TLastValue) {
    this.latestValue = latestValue
    this.underlyingStream = stream
  }

  get stream(): Observable<TLastValue> {
    return this.underlyingStream
  }
}
