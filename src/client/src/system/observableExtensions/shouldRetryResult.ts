export default class ShouldRetryResult {

  constructor(shouldRetry: boolean, retryAfterMilliseconds: number) {
    this._shouldRetry = shouldRetry;
    this._retryAfterMilliseconds = retryAfterMilliseconds;
  }

  _shouldRetry: boolean;

  get shouldRetry() {
    return this._shouldRetry;
  }

  _retryAfterMilliseconds: number;

  get retryAfterMilliseconds() {
    return this._retryAfterMilliseconds;
  }
}
