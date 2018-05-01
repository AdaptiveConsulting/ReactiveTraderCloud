import { Observable } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

/**
 * Adds distinctUntilChanged semantics to inner streams of a grouped observable
 */
export function distinctUntilChangedGroup<TValue>(
  comparisonFn: (last: TValue, next: TValue) => boolean
): (source: Observable<Observable<TValue>>) => Observable<Observable<TValue>> {
  return source =>
    new Observable(obs => {
      return source.subscribe(
        innerSource => {
          const distinctStream = innerSource.pipe(
            distinctUntilChanged(comparisonFn)
          )
          obs.next(distinctStream)
        },
        ex => obs.error(ex),
        () => obs.complete()
      )
    })
}
