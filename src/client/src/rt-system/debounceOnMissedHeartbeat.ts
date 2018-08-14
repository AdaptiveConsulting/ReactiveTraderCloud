import { merge, Observable, timer } from 'rxjs'
import { mapTo, switchMap } from 'rxjs/operators'
/**
 * Emits an item from the source Observable after a particular timespan has passed without the Observable omitting any other items.
 * The onTimeoutItemSelector selector is used to select the item to procure.
 */
export function debounceWithSelector<T>(
  dueTime: number,
  itemSelector: (lastValue: T) => T
): (source: Observable<T>) => Observable<T> {
  return source$ => {
    const timeout$ = source$.pipe(switchMap(last => timer(dueTime).pipe(mapTo(itemSelector(last)))))

    return merge(source$, timeout$)
  }
}
