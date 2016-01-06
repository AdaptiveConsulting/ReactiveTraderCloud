import ShouldRetryResult from './should-retry-result';

class IndefiniteRetryPolicy {
  shouldRetry(error:Error, retryCount:Number):ShouldRetryResult {
    return new ShouldRetryResult(true, 0); // retry right away
  }
}

class IndefiniteEvery2SecondsRetryPolicy {
  shouldRetry(error:Error, retryCount:Number):ShouldRetryResult {
    return new ShouldRetryResult(true, 2000);
  }
}
class BackoffTo10SecondsMax {
  shouldRetry(error:Error, retryCount:Number):ShouldRetryResult {
    let retryAfter = retryCount * 1000;
    retryAfter = retryAfter < 10000
      ? retryAfter
      : 10000; // retry right away
    return new ShouldRetryResult(true, retryAfter);
  }
}

export default class RetryPolicy {

  static get forever() {
    return new IndefiniteRetryPolicy();
  }

  static get backoffTo10SecondsMax() {
    return new BackoffTo10SecondsMax();
  }

  static get indefiniteEvery2Seconds() {
    return new IndefiniteEvery2SecondsRetryPolicy();
  }
}
