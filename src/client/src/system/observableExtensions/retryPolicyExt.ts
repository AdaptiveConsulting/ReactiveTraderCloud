import { Observable } from 'rxjs/Rx'
import { SerialSubscription } from '../../serialSubscription'

import logger from '../logger'
import { ShouldRetryResult } from './retryPolicy'

const log = logger.create('RetryPolicy')

function retryWithPolicy<TValue>(this: Observable<TValue>,
                                 retryPolicy: any,
                                 operationDescription: string,
                                 scheduler: any,
                                 onErrorCallback: (err: Error, willRetry: boolean) => void) {
  
  return Observable.create((o) => {
    let retryCount = 0
    let subscribe = null
    let isDisposed = false
    const currentSubscriptionDisposable = new SerialSubscription()
    subscribe = () => {
      currentSubscriptionDisposable.add(this.subscribe(
        (i) => {
          if (!isDisposed) {
            o.next(i)
          }
        },
        (err) => {
          retryCount += 1
          const shouldRetryResult: ShouldRetryResult = retryPolicy(err, retryCount)

          if (onErrorCallback) {
            // give the caller a chance to react to the error
            onErrorCallback(err, shouldRetryResult.shouldRetry)
          }
          if (shouldRetryResult.shouldRetry) {
            if (shouldRetryResult.retryAfterMilliseconds === 0) {
              log.warn(`Retrying [${operationDescription}]. This is attempt [${operationDescription}]`, err)
              subscribe()
            } else {
              log.warn(`Retrying [${operationDescription}] after [${shouldRetryResult.retryAfterMilliseconds}]. This is attempt [${retryCount}]`, err)
              // throwing away the disposable as we do a dispose check before we onNext
              scheduler.schedule(
                () => subscribe(),
                shouldRetryResult.retryAfterMilliseconds,
                '',
              )
            }
          } else {
            // don't retry
            log.error(`Not retrying [${operationDescription}]. Retry count [${retryCount}]. Will error`, err)
            o.error(err)
          }
        },
        () => o.onCompleted(),
      ))
    }
    subscribe()
    return () => {
      isDisposed = true
      currentSubscriptionDisposable.unsubscribe()
    }
  })
}

Observable.prototype['retryWithPolicy'] = retryWithPolicy
