import { Observable, Subscription } from 'rxjs/Rx';
import logger from '../logger';

var _log = logger.create('RetryPolicy');

function retryWithPolicy<TValue>(this: Observable<TValue>,
                                 retryPolicy,
                                 operationDescription: string,
                                 scheduler: any,
                                 onErrorCallback: (err: Error, willRetry: boolean) => void) {
  let source: Observable<TValue> = this;
  return Observable.create(o => {
    let retryCount = 0;
    let subscribe = null;
    let isDisposed = false;
    let currentSubscriptionDisposable = new Subscription();
    subscribe = () => {
      currentSubscriptionDisposable.add(source.subscribe(
        i => {
          if (!isDisposed) {
            o.onNext(i);
          }
        },
        err => {
          retryCount++;
          let shouldRetryResult = retryPolicy.shouldRetry(err, retryCount);
          if (onErrorCallback) {
            // give the caller a chance to react to the error
            onErrorCallback(err, shouldRetryResult);
          }
          if (shouldRetryResult.shouldRetry) {
            if (shouldRetryResult.retryAfterMilliseconds === 0) {
              _log.warn(`Retrying [${operationDescription}]. This is attempt [${operationDescription}]`, err);
              subscribe();
            } else {
              _log.warn(`Retrying [${operationDescription}] after [${shouldRetryResult.retryAfterMilliseconds}]. This is attempt [${retryCount}]`, err);
              // throwing away the disposable as we do a dispose check before we onNext
              scheduler.scheduleFuture(
                '',
                shouldRetryResult.retryAfterMilliseconds,
                () => subscribe()
              );
            }
          } else {
            // don't retry
            _log.error(`Not retrying [${operationDescription}]. Retry count [${retryCount}]. Will error`, err);
            o.onError(err);
          }
        },
        () => o.onCompleted()
      ));
    };
    subscribe();
    return () => {
      isDisposed = true;
      currentSubscriptionDisposable.unsubscribe();
    };
  });
}

Observable.prototype['retryWithPolicy'] = retryWithPolicy;
