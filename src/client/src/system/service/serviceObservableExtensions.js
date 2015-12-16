import Rx from 'rx';
import _ from 'lodash'
import logger from '../logger';
import LastValueObservable from './lastValueObservable';
import LastValueObservableDictionary from './lastValueObservableDictionary';
import ServiceInstanceStatus from './serviceInstanceStatus';

var _log : logger.Logger = logger.create('serviceObservableExtensions');

//function timeoutInnerObservables1<TKey, TValue>(dueTime : Number, onTimeoutItemSelector : (key: TKey) => TValue, scheduler : Rx.Scheduler) {
//    var sources : Rx.GroupedObservable = this;
//    return Rx.Observable.create(o => {
//        return sources.select(innerSource => {
//            var key : TKey = innerSource.key;
//            return innerSource.debounceWithSelector(dueTime, () => onTimeoutItemSelector(key), scheduler);
//        }).subscribe(o);
//    });
//}

// Adds time out semantics to the inner observable streams, calls onTimeoutItemSelector to seed a single value on timeout
function timeoutInnerObservables<TKey, TValue>(dueTime : Number, onTimeoutItemSelector : (key: TKey) => TValue, scheduler : Rx.Scheduler) {
    var sources : Rx.GroupedObservable = this;
    return Rx.Observable.create(o => {
        return sources.subscribe(innerSource => {
                var key : TKey = innerSource.key;
                var debouncedStream = innerSource.debounceWithSelector(dueTime, () => onTimeoutItemSelector(key), scheduler);
                o.onNext(debouncedStream);
            },
            ex => o.onError(ex),
            () => o.onCompleted()
        );
    });
}
Rx.Observable.prototype.timeoutInnerObservables = timeoutInnerObservables;

// Converts an Observable of Observables into an Observable of IDictionary<TKey, ILastValueObservable<TValue>> whereby ILastValueObservable items are hot observable streams exposing their last values
function toLastValueObservableDictionary<TKey, TValue>(keySelector : (value : TValue) => TKey) : Rx.Observable<ServiceInstanceCache> {
    var sources = this;
    return Rx.Observable.create(o => {
        var dictionary = new LastValueObservableDictionary();
        var disposables = new Rx.CompositeDisposable();
        disposables.add(
            sources.subscribe(
                innerSource => {
                   // var innerSourcePublished = innerSource.publish().refCount();
                    disposables.add(innerSource.subscribe(
                        value => {
                            var key = keySelector(value);
                            if (!dictionary.hasKey(key))                             {
                                dictionary.add(key, new LastValueObservable(innerSource, value));
                            }
                            else {
                                dictionary.updateWithLatestValue(key, value);
                            }
                            o.onNext(dictionary); // note: not creating a copy of local state
                        },
                        ex => {
                            try {
                                o.onError(ex);
                            } catch (err1) {
                                debugger;
                            }
                        },// if any of the inner streams error or complete, we error the outer
                        () => o.onCompleted()
                    ));
                },
                ex => o.onError(ex),
                () => o.onCompleted()
            )
        );
        return disposables;
    });
}
Rx.Observable.prototype.toLastValueObservableDictionary = toLastValueObservableDictionary;

// Gets the first status stream for the service currently having the minimum load and subscribes to it, yields into the target stream
function getServiceWithMinLoad() : Rx.Observable<LastValueObservable<ServiceInstanceStatus>> {
    var source : Rx.Observable<LastValueObservableDictionary<ServiceInstanceStatus>> = this;
    return Rx.Observable.create(o => {
        let disposables = new Rx.CompositeDisposable();
        let findServiceInstanceDisposable = new Rx.SingleAssignmentDisposable();
        disposables.add(findServiceInstanceDisposable);
        findServiceInstanceDisposable = source.subscribe(
            dictionary => {
                var serviceWithLeastLoad : LastValueObservable<ServiceInstanceStatus> = _(dictionary.values)
                    .sortBy(i => i.latestValue.serviceLoad)
                    .find(i => i.latestValue.isConnected);
                if (serviceWithLeastLoad) {
                    findServiceInstanceDisposable.dispose();
                    var serviceStatusStream = Rx.Observable
                        .return(serviceWithLeastLoad.latestValue)
                        .concat(serviceWithLeastLoad.stream)
                        .subscribe(o);
                    disposables.add(serviceStatusStream);
                }
            },
            ex => {
                try {
                    o.onError(ex);
                } catch (err1) {
                    debugger;
                }
            }
        );
        return disposables;
    });
}
Rx.Observable.prototype.getServiceWithMinLoad = getServiceWithMinLoad;

// Emits an item from the source Observable after a particular timespan has passed without the Observable omitting any other items.
// The onTimeoutItemSelector selector is used to select the item to procure.
function debounceWithSelector(dueTime : Number, itemSelector : () => TValue, scheduler : Rx.Scheduler) {
    var source = this;
    return Rx.Observable.create(o => {
        var disposables = new Rx.CompositeDisposable();
        var debounceDisposable = new Rx.SerialDisposable();
        disposables.add(debounceDisposable);
        var debounce = () => {
            debounceDisposable.setDisposable(
                scheduler.scheduleFuture(
                    '',
                    dueTime,
                    () => {
                        let debouncedItem = itemSelector();
                        o.onNext(debouncedItem)
                    }
                )
            );
        };
        disposables.add(
            source.subscribe(
                item => {
                    debounce();
                    o.onNext(item)
                },
                ex => {
                    try {
                        o.onError(ex);
                    } catch (err1) {
                        debugger;
                    }
                },
                () => o.onCompleted()
            )
        );
        debounce();
        return disposables;
    });
}
Rx.Observable.prototype.debounceWithSelector = debounceWithSelector;