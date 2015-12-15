import Rx from 'rx';
import LastValueObservable from './lastValueObservable';
import LastValueObservableDictionary from './lastValueObservableDictionary';

// Adds time out semantics to the inner observable streams, calls onTimeoutItemSelector to seed a single value on timeout
function timeoutInnerObservables<TKey, TValue>(dueTime : Number, onTimeoutItemSelector : (key: TKey) => TValue, scheduler : Rx.Scheduler) {
    var sources = this;
    return Rx.Observable.create(o => {
        return sources.select(innerSource => {
            var key : TKey = innerSource.key;
            return innerSource
                .timeout(dueTime, Rx.Observable.return(onTimeoutItemSelector(key)), scheduler)
                .repeat();
        }).subscribe(o);
    });
}
Rx.Observable.prototype.timeoutInnerObservables = timeoutInnerObservables;

/// <summary>
/// Converts an Observable of Observables into an Observable of IDictionary<TKey, ILastValueObservable<TValue>> whereby ILastValueObservable items are hot observable streams exposing their last values
/// </summary>
function toLastValueObservableDictionary<TKey, TValue>(keySelector : (value : TValue) => TKey) : Rx.Observable<ServiceInstanceCache> {
    var sources = this;
    return Rx.Observable.create(o => {
        var dictionary = new LastValueObservableDictionary();
        var disposables = new Rx.CompositeDisposable();
        disposables.add(
            sources.subscribe(
                innerSource => {
                    var innerSourcePublished = innerSource.replay(1).refCount();
                    disposables.add(
                        innerSourcePublished.subscribe(value => {
                            var key = keySelector(value);
                            if (!dictionary.hasKey(key))                             {
                                dictionary.add(key, new LastValueObservable(innerSourcePublished, value));
                            }
                            else {
                                dictionary.updateWithLatestValue(key, value);
                            }
                            o.onNext(dictionary); // note: not creating a copy of local state
                        })
                    );
                },
                ex => o.onError(ex),
                () => o.onCompleted()
            )
        );
        return disposables;
    });
}
Rx.Observable.prototype.toLastValueObservableDictionary = toLastValueObservableDictionary;
