import Rx from 'rx';
import _ from 'lodash';
import RetryPolicy from './policy';
import logger from '../logger';
import ShouldRetryResult from './shouldRetryResult';

var _log:logger.Logger = logger.create('RetryPolicy');

function retryWithPolicy<TValue>(retryPolicy, operationDescription:String, scheduler:Rx.Scheduler):Rx.Observable<TValue> {
  var source:Rx.Observable<TValue> = this;
  return Rx.Observable.create(o => {
    let retryCount:Number = 0;
    let subscribe:() => void = null;
    let isDisposed = false;
    let currentSubscriptionDisposable = new Rx.SerialDisposable();
    subscribe = () => {
      currentSubscriptionDisposable.setDisposable(source.subscribe(
        i => {
          if (!isDisposed) {
            o.onNext(i);
          }
        },
        ex => {
          retryCount++;
          let shouldRetryResult:ShouldRetryResult = retryPolicy.shouldRetry(ex, retryCount);
          if (shouldRetryResult.shouldRetry) {
            if (shouldRetryResult.retryAfterMilliseconds === 0) {
              _log.warn(`Retrying [${operationDescription}]. This is attempt [${operationDescription}]. Exception: [${ex.message}]`);
              subscribe();
            } else {
              _log.warn(`Retrying [${operationDescription}] after [${shouldRetryResult.retryAfterMilliseconds}]. This is attempt [${retryCount}]. Exception: [${ex.message}]`);
              // throwing away the disposable as we do a dispose check before we onNext
              scheduler.scheduleFuture(
                '',
                shouldRetryResult.retryAfterMilliseconds,
                () => subscribe()
              );
            }
          }
          else {
            // don't retry
            _log.error(`Not retrying [${operationDescription}]. Retry count [${retryCount}]. Will error. Exception: [${ex.message}]`);
            o.onError(ex);
          }
        },
        () => o.onCompleted()
      ));
    };
    subscribe();
    return () => {
      isDisposed = true;
      currentSubscriptionDisposable.dispose();
    };
  });
}
Rx.Observable.prototype.retryWithPolicy = retryWithPolicy;
