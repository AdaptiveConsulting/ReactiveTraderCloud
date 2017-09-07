import { Observable, Subscription } from 'rxjs/Rx'
import { SerialSubscription } from '../../serialSubscription'
import * as _ from 'lodash'
import LastValueObservable from './lastValueObservable'
import LastValueObservableDictionary from './lastValueObservableDictionary'

/**
 * Adds timeout semantics to the inner observable streams, on timeout calls onDebounceItemFactory to get the item to pump down the stream
 * @param dueTime
 * @param onDebounceItemFactory
 * @param scheduler
 * @returns {Logger|Object}
 */
function debounceOnMissedHeartbeat<TValue>(this: Observable<TValue>, dueTime, onDebounceItemFactory, scheduler) {
  return Observable.create((o) => {
    return this.subscribe((innerSource: any) => {
        const key = innerSource.key
        const debouncedStream = innerSource.debounceWithSelector(dueTime, () => onDebounceItemFactory(key), scheduler)
        o.next(debouncedStream)
      },
      ex => o.error(ex),
      () => o.complete(),
    )
  })
}
Observable.prototype['debounceOnMissedHeartbeat'] = debounceOnMissedHeartbeat

/**
 * Flattens an Observable of Observables into an Observable of LastValueObservableDictionary.
 *
 * LastValueObservableDictionary is a object containing the inner observable streams, it's suitable for querying based
 * on an inner streams latest value. For example: get stream for service with min load
 * @param keySelector
 * @returns {Logger|Object}
 */
function toServiceStatusObservableDictionary<TValue>(this: Observable<TValue>, keySelector) {
  const sources = <any>this
  return Observable.create(o => {
    const dictionary = new LastValueObservableDictionary()
    const disposables = new Subscription()
    disposables.add(
      sources.subscribe(
        innerSource => {
          disposables.add(innerSource.subscribe(
            value => {
              const key = keySelector(value)
              if (!dictionary.hasKey(key)) {
                dictionary.add(key, new LastValueObservable(innerSource, value))
              } else {
                dictionary.updateWithLatestValue(key, value)
              }
              o.next(dictionary) // note: not creating a copy of local state, something we could do
            },
            ex => {
              try {
                o.error(ex)
              } catch (err1) {}
            },// if any of the inner streams error or complete, we error the outer
            () => o.complete(),
          ))
        },
        ex => o.error(ex),
        () => o.complete(),
      ),
    )
    return disposables
  })
}
Observable.prototype['toServiceStatusObservableDictionary'] = toServiceStatusObservableDictionary

/**
 * Gets the first status stream for the service currently having the minimum load, then subscribes to it yielding updates into the target observer
 * @param waitForServiceIfNoneAvailable
 * @returns {Observable}
 */
function getServiceWithMinLoad<TValue>(this: Observable<TValue>, waitForServiceIfNoneAvailable = true) {
  return Observable.create((o) => {
    const disposables = new Subscription()
    let findServiceInstanceDisposable = new Subscription()
    disposables.add(findServiceInstanceDisposable)
    findServiceInstanceDisposable = this.subscribe(
      (dictionary: any) => {
        const serviceWithLeastLoad = _(dictionary.values)
          .sortBy(i => i.latestValue.serviceLoad)
          .find(i => i.latestValue.isConnected)
        if (serviceWithLeastLoad) {
          findServiceInstanceDisposable.unsubscribe()
          const serviceStatusStream = Observable.of(serviceWithLeastLoad.latestValue)
            .concat(serviceWithLeastLoad.stream)
            .subscribe(o)
          disposables.add(serviceStatusStream)
        } else if (!waitForServiceIfNoneAvailable) {
          o.error(new Error('No service available'))
        }
      },
      (ex) => {
        o.error(ex)
      },
    )
    return disposables
  })
}
Observable.prototype['getServiceWithMinLoad'] = getServiceWithMinLoad

/**
 * Adds distinctUntilChanged semantics to inner streams of a grouped observable
 */
function distinctUntilChangedGroup<TValue>(this: Observable<TValue>, comparisonFn) {
  return Observable.create((o) => {
    return this.subscribe((innerSource: any) => {
        const distinctStream = innerSource.distinctUntilChanged(comparisonFn)
        o.next(distinctStream)
      },
      (ex) => o.error(ex),
      () => o.complete(),
    )
  })
}
Observable.prototype['distinctUntilChangedGroup'] = distinctUntilChangedGroup

/**
 * Emits an item from the source Observable after a particular timespan has passed without the Observable omitting any other items.
 * The onTimeoutItemSelector selector is used to select the item to procure.
 * @param dueTime
 * @param itemSelector
 * @param scheduler
 * @returns {Observable}
 */
function debounceWithSelector<TValue>(this: Observable<TValue>, dueTime, itemSelector, scheduler) {
  return Observable.create(o => {
    let disposables = new Subscription();
    let debounceDisposable = new SerialSubscription();
    disposables.add(debounceDisposable);
    let debounce = () => {
      debounceDisposable.add(
        scheduler.schedule(
          () => {
            let debouncedItem = itemSelector();
            o.next(debouncedItem);
          },
          dueTime,
          '',
        )
      );
    };
    disposables.add(
      this.subscribe(
        item => {
          debounce();
          o.next(item);
        },
        ex => {
          try {
            o.error(ex);
          } catch (err1) {
          }
        },
        () => o.complete()
      )
    );
    debounce();
    return disposables;
  });
}
Observable.prototype['debounceWithSelector'] = debounceWithSelector
