import { Action } from 'redux'
import { ActionUnion } from 'rt-util/ActionHelper'
import { switchMapTo, map } from 'rxjs/operators'
import { ActionsObservable, StateObservable, ofType } from 'redux-observable'
import { setupWorkspaces } from './openFin'

export const customEpics = (actions: ActionUnion<any>, types: any) => {
  const setupLayout = ofType<Action, typeof actions.setup>(types.SETUP)

  return [
    (action$: ActionsObservable<Action>, _: StateObservable<any>) => {
      return action$.pipe(
        setupLayout,
        switchMapTo(setupWorkspaces().pipe(map(actions.updateContainerVisibilityAction))),
      )
    },
  ]
}
