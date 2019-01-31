import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { TestScheduler } from 'rxjs/testing'
import { Action, ActionWithPayload } from 'rt-util'

export const createScheduler = (assertDeepEqual?: (actual: any, expected: any) => boolean | void) =>
  new TestScheduler(assertDeepEqual || ((actual, expected) => expect(actual).toEqual(expected)))

export function fromMarbles<TResult>(
  selector: (name: string | number | {}) => TResult,
  cold: (marbles: string) => Observable<{}>,
  serviceStream: string,
): Observable<TResult> {
  return cold(serviceStream).pipe(map(selector))
}

export function fromActionsToMarbles<TPayload>(
  action$: Observable<ActionWithPayload<any, TPayload> | Action<any>>,
  marbleSelector: (action: ActionWithPayload<any, TPayload>) => number | string | {},
) {
  return action$.pipe(map(action => marbleSelector(action as ActionWithPayload<any, TPayload>)))
}
