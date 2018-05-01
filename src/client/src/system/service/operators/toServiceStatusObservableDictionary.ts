import { Observable, Subscription } from 'rxjs'
import LastValueObservable from './../lastValueObservable'
import LastValueObservableDictionary from './../lastValueObservableDictionary'

/**
 * Flattens an Observable of Observables into an Observable of LastValueObservableDictionary.
 *
 * LastValueObservableDictionary is a object containing the inner observable streams, it's suitable for querying based
 * on an inner streams latest value. For example: get stream for service with min load
 * @param keySelector
 * @returns {Logger|Object}
 */
export function toServiceStatusObservableDictionary<TValue>(
  keySelector: (item: TValue) => string
): (
  source: Observable<Observable<TValue>>
) => Observable<LastValueObservableDictionary<TValue>> {
  return source =>
    new Observable(o => {
      const dictionary = new LastValueObservableDictionary<TValue>()
      const disposables = new Subscription()

      disposables.add(
        source.subscribe(
          innerSource => {
            disposables.add(
              innerSource.subscribe(
                value => {
                  const key = keySelector(value)
                  if (!dictionary.hasKey(key)) {
                    dictionary.add(
                      key,
                      new LastValueObservable<TValue>(innerSource, value)
                    )
                  } else {
                    dictionary.updateWithLatestValue(key, value)
                  }
                  o.next(dictionary) // note: not creating a copy of local state, something we could do
                },
                ex => {
                  try {
                    o.error(ex)
                  } catch (err1) {}
                }, // if any of the inner streams error or complete, we error the outer
                () => o.complete()
              )
            )
          },
          ex => o.error(ex),
          () => o.complete()
        )
      )
      return disposables
    })
}
