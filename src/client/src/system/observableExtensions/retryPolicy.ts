export interface ShouldRetryResult {
  shouldRetry: boolean
  retryAfterMilliseconds: number
}

export default class RetryPolicy {
  static forever = function (error, retryCount): ShouldRetryResult {
    return {
      shouldRetry: true,
      retryAfterMilliseconds: 0,
      // retry right away
    }
  }

  static indefiniteEvery2Seconds = function (error, retryCount): ShouldRetryResult {
    return {
      shouldRetry: true,
      retryAfterMilliseconds: 2000,
    }
  }

  static backoffTo10SecondsMax = function (error, retryCount): ShouldRetryResult {
    let retryAfter = retryCount * 1000
    retryAfter = retryAfter < 10000
      ? retryAfter
      : 10000 // retry right away
    return {
      shouldRetry: true,
      retryAfterMilliseconds: retryAfter,
    }
  }
}
