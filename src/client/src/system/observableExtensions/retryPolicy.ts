export interface ShouldRetryResult {
  shouldRetry: boolean
  retryAfterMilliseconds: number
}

export type Retry = (error: string, retryCount: number) => ShouldRetryResult

export default class RetryPolicy {
  static forever: Retry = function(error, retryCount) {
    return {
      shouldRetry: true,
      retryAfterMilliseconds: 0
      // retry right away
    }
  }

  static indefiniteEvery2Seconds: Retry = function(error, retryCount) {
    return {
      shouldRetry: true,
      retryAfterMilliseconds: 2000
    }
  }

  static backoffTo10SecondsMax: Retry = function(error, retryCount) {
    let retryAfter = retryCount * 1000
    retryAfter = retryAfter < 10000 ? retryAfter : 10000 // retry right away
    return {
      shouldRetry: true,
      retryAfterMilliseconds: retryAfter
    }
  }
}
