import Rx from 'rx';
import _ from 'lodash';
import RetryPolicy from './retry-policy';
import logger from '../logger';
import ShouldRetryResult from './should-retry-result';

var _log:logger.Logger = logger.create('RetryPolicy');

function retryWithPolicy<TValue>(
  retryPolicy,
  operationDescription:String,
  scheduler:Rx.Scheduler,
  onErrorCallback:(err:Error, willRetry:Boolean) => void
):Rx.Observable<TValue> {
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
        err => {
          retryCount++;
          let shouldRetryResult:ShouldRetryResult = retryPolicy.shouldRetry(err, retryCount);
          if(onErrorCallback) {
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
      currentSubscriptionDisposable.dispose();
    };
  });
}
Rx.Observable.prototype.retryWithPolicy = retryWithPolicy;
