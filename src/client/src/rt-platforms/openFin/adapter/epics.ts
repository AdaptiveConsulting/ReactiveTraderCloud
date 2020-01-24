import { Action } from 'redux'
import { map, switchMapTo } from 'rxjs/operators'
import { ActionsObservable, ofType, StateObservable } from 'redux-observable'
import { LayoutActions } from 'rt-actions/layoutActions'
import { setupWorkspaces } from './openFin'
import { ApplicationEpic } from 'StoreTypes'
import { SetupAction, CONNECTION_ACTION_TYPES } from 'rt-actions/setupActions'

export const platformEpics: Array<ApplicationEpic> = [
  (action$: ActionsObservable<Action>, _: StateObservable<any>) => {
    return action$.pipe(
      ofType<Action, SetupAction>(CONNECTION_ACTION_TYPES.SETUP),
      switchMapTo(setupWorkspaces().pipe(map(LayoutActions.updateContainerVisibilityAction))),
    )
  },
]
