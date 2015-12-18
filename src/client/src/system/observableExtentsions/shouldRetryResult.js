export default class ShouldRetryResult {
    constructor(shouldRetry:Boolean, retryAfterMilliseconds:Number) {
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