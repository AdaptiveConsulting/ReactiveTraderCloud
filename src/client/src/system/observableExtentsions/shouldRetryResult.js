export default class ShouldRetryResult {
  constructor(shouldRetry:boolean, retryAfterMilliseconds:number) {
    this._shouldRetry = shouldRetry;
    this._retryAfterMilliseconds = retryAfterMilliseconds;
  }

  get shouldRetry() {
    return this._shouldRetry;
  }

  get retryAfterMilliseconds() {
    return this._retryAfterMilliseconds;
  }
}
