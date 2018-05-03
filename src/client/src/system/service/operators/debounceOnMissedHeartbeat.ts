import { Observable, Scheduler, Subscription } from 'rxjs'
import { GroupedObservable } from 'rxjs/operators/groupBy'
import { SerialSubscription } from '../../serialSubscription'

/**
 * Adds timeout semantics to the inner observable streams, on timeout calls onDebounceItemFactory to get the item to pump down the stream
 */

export function debounceOnMissedHeartbeat<T>(
  dueTime: number,
  onDebounceItemFactory: (key: string) => T,
  scheduler: Scheduler
): (
  source: Observable<GroupedObservable<string, T>>
) => Observable<Observable<T>> {
  return source =>
    new Observable(obs => {
      source.subscribe(
        next => {
          const key = next.key
          const debouncedStream = next.pipe(
            debounceWithSelector<T>(
              dueTime,
              () => onDebounceItemFactory(key),
              scheduler
            )
          )

          obs.next(debouncedStream)
        },
        ex => obs.error(ex),
        () => obs.complete()
      )
    })
}

/**
 * Emits an item from the source Observable after a particular timespan has passed without the Observable omitting any other items.
 * The onTimeoutItemSelector selector is used to select the item to procure.
 */
export function debounceWithSelector<TValue>(
  dueTime: number,
  itemSelector: () => TValue,
  scheduler: Scheduler
): (source: Observable<TValue>) => Observable<TValue> {
  return source =>
    new Observable(obs => {
      const disposables = new Subscription()
      const debounceDisposable = new SerialSubscription()
      disposables.add(debounceDisposable)

      const debounce = () => {
        debounceDisposable.add(
          scheduler.schedule(
            () => {
              const debouncedItem = itemSelector()
              obs.next(debouncedItem)
            },
            dueTime,
            ''
          )
        )
      }

      disposables.add(
        source.subscribe(
          item => {
            debounce()
            obs.next(item)
          },
          ex => {
            try {
              obs.error(ex)
            } catch (err1) {}
          },
          () => obs.complete()
        )
      )
      debounce()
      return disposables
    })
}
