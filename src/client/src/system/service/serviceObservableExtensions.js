import Rx from 'rx';
import _ from 'lodash';
import logger from '../logger';
import LastValueObservable from './lastValueObservable';
import LastValueObservableDictionary from './lastValueObservableDictionary';
import ServiceInstanceStatus from './serviceInstanceStatus';

/**
 * Adds timeout semantics to the inner observable streams, on timeout calls onDebounceItemFactory to get the item to pump down the stream
 * @param dueTime
 * @param onDebounceItemFactory
 * @param scheduler
 * @returns {Logger|Object}
 */
function debounceOnMissedHeartbeat<TKey, TValue>(dueTime:number, onDebounceItemFactory:(key:TKey) => TValue, scheduler:Rx.Scheduler) {
  let sources:Rx.GroupedObservable = this;
  return Rx.Observable.create(o => {
    return sources.subscribe(innerSource => {
        let key:TKey = innerSource.key;
        let debouncedStream = innerSource.debounceWithSelector(dueTime, () => onDebounceItemFactory(key), scheduler);
        o.onNext(debouncedStream);
      },
      ex => o.onError(ex),
      () => o.onCompleted()
    );
  });
}
Rx.Observable.prototype.debounceOnMissedHeartbeat = debounceOnMissedHeartbeat;

/**
 * Flattens an Observable of Observables into an Observable of LastValueObservableDictionary.
 *
 * LastValueObservableDictionary is a object containing the inner observable streams, it's suitable for querying based
 * on an inner streams latest value. For example: get stream for service with min load
 * @param keySelector
 * @returns {Logger|Object}
 */
function toServiceStatusObservableDictionary<TKey, TValue>(keySelector:(value:TValue) => TKey):Rx.Observable<ServiceInstanceCache> {
  let sources = this;
  return Rx.Observable.create(o => {
    let dictionary = new LastValueObservableDictionary();
    let disposables = new Rx.CompositeDisposable();
    disposables.add(
      sources.subscribe(
        innerSource => {
          disposables.add(innerSource.subscribe(
            value => {
              let key = keySelector(value);
              if (!dictionary.hasKey(key)) {
                dictionary.add(key, new LastValueObservable(innerSource, value));
              }
              else {
                dictionary.updateWithLatestValue(key, value);
              }
              o.onNext(dictionary); // note: not creating a copy of local state, something we could do
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
Rx.Observable.prototype.toServiceStatusObservableDictionary = toServiceStatusObservableDictionary;

/**
 * Gets the first status stream for the service currently having the minimum load, then subscribes to it yielding updates into the target observer
 * @param waitForServiceIfNoneAvailable
 * @returns {Observable}
 */
function getServiceWithMinLoad(waitForServiceIfNoneAvailable:boolean = true):Rx.Observable<LastValueObservable<ServiceInstanceStatus>> {
  let source:Rx.Observable<LastValueObservableDictionary<ServiceInstanceStatus>> = this;
  return Rx.Observable.create(o => {
    let disposables = new Rx.CompositeDisposable();
    let findServiceInstanceDisposable = new Rx.SingleAssignmentDisposable();
    disposables.add(findServiceInstanceDisposable);
    findServiceInstanceDisposable = source.subscribe(
      dictionary => {
        let serviceWithLeastLoad:LastValueObservable<ServiceInstanceStatus> = _(dictionary.values)
          .sortBy(i => i.latestValue.serviceLoad)
          .find(i => i.latestValue.isConnected);
        if (serviceWithLeastLoad) {
          findServiceInstanceDisposable.dispose();
          let serviceStatusStream = Rx.Observable
            .return(serviceWithLeastLoad.latestValue)
            .concat(serviceWithLeastLoad.stream)
            .subscribe(o);
          disposables.add(serviceStatusStream);
        } else if (!waitForServiceIfNoneAvailable) {
          o.onError(new Error('No service available'));
        }
      },
      ex => {
        o.onError(ex);
      }
    );
    return disposables;
  });
}
Rx.Observable.prototype.getServiceWithMinLoad = getServiceWithMinLoad;

/**
 * Adds distinctUntilChanged semantics to inner streams of a grouped observable
 */
function distinctUntilChangedGroup<TKey, TValue>(keySelector:(value:TValue) => Object) : Rx.Observable<Rx.Observable<TValue>> {
  let sources:Rx.Observable<Rx.Observable<TValue>> = this;
  return Rx.Observable.create(o => {
    return sources.subscribe(innerSource => {
        var distinctStream = innerSource.distinctUntilChanged(value => keySelector(value));
        o.onNext(distinctStream);
      },
      ex => o.onError(ex),
      () => o.onCompleted()
    );
  });
}
Rx.Observable.prototype.distinctUntilChangedGroup = distinctUntilChangedGroup;

/**
 * Emits an item from the source Observable after a particular timespan has passed without the Observable omitting any other items.
 * The onTimeoutItemSelector selector is used to select the item to procure.
 * @param dueTime
 * @param itemSelector
 * @param scheduler
 * @returns {Observable}
 */
function debounceWithSelector(dueTime:number, itemSelector:() => TValue, scheduler:Rx.Scheduler) {
  let source = this;
  return Rx.Observable.create(o => {
    let disposables = new Rx.CompositeDisposable();
    let debounceDisposable = new Rx.SerialDisposable();
    disposables.add(debounceDisposable);
    let debounce = () => {
      debounceDisposable.setDisposable(
        scheduler.scheduleFuture(
          '',
          dueTime,
          () => {
            let debouncedItem = itemSelector();
            o.onNext(debouncedItem);
          }
        )
      );
    };
    disposables.add(
      source.subscribe(
        item => {
          debounce();
          o.onNext(item);
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
