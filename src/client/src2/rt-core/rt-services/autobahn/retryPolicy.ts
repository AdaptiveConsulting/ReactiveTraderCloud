import { Observable, throwError, timer } from 'rxjs'
import { finalize, mergeMap } from 'rxjs/operators'

const LOG_NAME = 'Retry: '

export const retryWithBackOff = ({
  maxRetryAttempts = Number.POSITIVE_INFINITY,
  scalingDuration = 1000,
}: {
  maxRetryAttempts?: number
  scalingDuration?: number
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts) {
        return throwError(error)
      }
      console.info(LOG_NAME, `Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`)
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration)
    }),
    finalize(() => console.log('We are done!')),
  )
}

export const retryConstantly = ({
  maxRetryAttempts = Number.POSITIVE_INFINITY,
  interval = 1000,
}: {
  maxRetryAttempts?: number
  interval?: number
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts) {
        return throwError(error)
      }

      console.info(LOG_NAME, `Attempt ${retryAttempt}`)

      return timer(interval)
    }),
    finalize(() => console.log('We are done!')),
  )
}
