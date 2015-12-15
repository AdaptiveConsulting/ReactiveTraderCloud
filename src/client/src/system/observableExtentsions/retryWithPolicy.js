import Rx from 'rx';
import _ from 'lodash'
import RetryPolicy from './retryPolicy';
import logger from '../logger';

var _log : logger.Logger = logger.create('RetryPolicy');

function retryWithPolicy(retryPolicy : RetryPolicy,  operationDescription : String, scheduler : Rx.Scheduler) {
    var source = this;
    return Rx.Observable.create(o => {
        let retryCount : Number = 0;
        let subscribe : () => void = null;
        let isDisposed = false;
        let currentSubscriptionDisposable = new Rx.SerialDisposable();
        subscribe = () => {
            currentSubscriptionDisposable.setDisposable(source.subscribe(
                i => {
                    if(!isDisposed) {
                        o.onNext(i);
                    }
                },
                ex => {
                    let retryAfter = retryPolicy.getRetryAfterMilliseconds(ex, ++retryCount);
                    if(retryAfter === 0) {
                        _log.warn("Retrying [{0}]. This is attempt [{1}]. Exception: [{2}]", operationDescription, retryCount, ex);
                        subscribe();
                    } else if (retryAfter > 0) {
                        _log.warn("Retrying [{0}] after [{1}]. This is attempt [{2}]. Exception: [{3}]", operationDescription, retryAfter, retryCount, ex);
                        scheduler.scheduleFuture(
                            '',
                            retryAfter,
                            () => subscribe()
                        );
                    } else {
                        // don't retry
                        _log.error("Not retrying [{0}]. Retry count [{1}]. Will error. Exception: [{2}]", operationDescription, retryCount, ex);
                        o.onError(ex);
                    }
                },
                () => observer.onCompleted()
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
