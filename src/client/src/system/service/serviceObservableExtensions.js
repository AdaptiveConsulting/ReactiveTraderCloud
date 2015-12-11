import Rx from 'rx';
import LastValueObservable from './lastValueObservable';
import ServiceInstanceCache from './serviceInstanceCache';

function takeUntilAndEndWith<TValue, TOther>(terminationSequence : Rx.Observable<TOther>, endWithItemFactory : (lastItem: TValue) => TValue) {
    var source = this;
    return Rx.Observable.create(o => {
        var disposables = new Rx.CompositeDisposable();
        var  lastItemSet : Boolean = false;
        var lastItem : TValue;
        disposables.add(
            terminationSequence.take(1).subscribe(
                _ => {
                    if(lastItemSet) {
                        var finalItem = endWithItemFactory(lastItem);
                        o.onNext(finalItem);
                    }
                    o.onCompleted();
                },
                ex => o.onError(ex),
                () => o.onCompleted()
            )
        );
        disposables.add(
            source.subscribe(
                i => {
                    lastItem = i;
                    lastItemSet = true;
                    o.onNext(i);
                },
                ex => o.onError(ex),
                () => o.onCompleted()
            )
        );
        return disposables;
    });
}
Rx.Observable.prototype.takeUntilAndEndWith = takeUntilAndEndWith;


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
        var cache = new ServiceInstanceCache();
        var disposables = new Rx.CompositeDisposable();
        disposables.add(
            sources.subscribe(
                innerSource => {
                    var innerSourcePublished = innerSource.replay(1).refCount();
                    disposables.add(
                        innerSourcePublished.subscribe(value => {
                            var key = keySelector(value);
                            if (!cache.hasOwnProperty(key))                             {
                                cache.add(key, new LastValueObservable(innerSourcePublished, value));
                            }
                            else {
                                cache.updateWithLastestValue(key, value);
                            }
                            o.onNext(cache); // note: not creating a copy of local state
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
