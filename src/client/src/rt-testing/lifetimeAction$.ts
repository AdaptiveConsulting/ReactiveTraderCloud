import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConnectionActions } from 'rt-actions'
import { Action } from 'rt-util'

/*
 * The marbles for custom actions such as mount/subscription must be specified
 * between the 'C' and 'D' marbles within your marble diagram, although both of
 * the 'C' and 'D' marbles themselves are optional.
 *
 *
 * The marbles that represent your custom actions MUST be monotonically
 * increasing numbers, starting at the number 1.
 *
 * EXAMPLES
 *   Valid: ''                   -- No ations are generated.
 *   Valid: '--C--'              -- Only the app connected action is generated.
 *   Valid: '--C------D----'     -- Generates the app connected action, followed eventually by the disconnected action.
 *   Valid: '-C----1-D|'         -- App connected, then custom action #1 is eventually generated, and finally the disconnected action.
 *   Valid: '-C----1---'         -- App connected, then custom action #1 is eventually generated, and no further actions appear.
 *   Valid: '--C--1--2--3--D--'  -- App connected, then custom actions ##1, 2, 3, and finally the disconnected action.
 *   Valid: '---1--C---'         -- Custom action #1, then the app connected action.
 *   Valid: '--1--C--2--'        -- Custom action #1, then the app connected action, and finally custom action #2.
 *
 * Invalid: '--C--0--D--'        -- Custom actions' marbles must start at 1
 * Invalid: '--C--1--4--'        -- Custom actions' marbles must increase monotonically; e.g., 1, 2, 3, 4, 5...
 * Invalid: '--C--a--b--e--D--'  -- Custom actions' marbles cannot be letters.
 * Invalid: '--C--C--1--2--D--'  -- Only one 'C' marble is permitted. Likewise, only one 'D' marble is permitted as well.
 *
 */
export enum AppLifetimeEvent {
  Connect = 'C',
  Disconnect = 'D',
}

export function mockLifetimeAction$(
  action$: Observable<string>,
  ...actionFactories: Array<() => Action<any>>
): Observable<Action<any>> {
  return mockAction$(
    action$,
    getFactoryIndex,
    ...[ConnectionActions.connect, ...actionFactories, ConnectionActions.disconnect],
  )

  function getFactoryIndex(lifetimeEvent: string): number {
    if (lifetimeEvent === AppLifetimeEvent.Connect) {
      return 0
    } else if (lifetimeEvent === AppLifetimeEvent.Disconnect) {
      return actionFactories.length + 1
    } else {
      return parseInt(lifetimeEvent)
    }
  }
}

export function mockAction$<TActionId>(
  action$: Observable<TActionId>,
  getFactoryIndex: (actionId: TActionId) => number,
  ...actionFactories: Array<() => Action<any>>
): Observable<Action<any>> {
  return action$.pipe(map(actionId => actionFactories[getFactoryIndex(actionId)]()))
}
