import { Observable, throwError, timer } from 'rxjs'
import { finalize, mergeMap } from 'rxjs/operators'
import logger from './logger'

const log = logger.create('Retry')

export const retryWithBackOff = ({
  maxRetryAttempts = 3,
  scalingDuration = 1000
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
      log.info(
        `Attempt ${retryAttempt}: retrying in ${retryAttempt *
          scalingDuration}ms`
      )
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration)
    }),
    finalize(() => console.log('We are done!'))
  )
}

export const retryConstantly = ({
  maxRetryAttempts = 3,
  interval = 1000
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

      log.info(`Attempt ${retryAttempt}`)

      return timer(interval)
    }),
    finalize(() => console.log('We are done!'))
  )
}
