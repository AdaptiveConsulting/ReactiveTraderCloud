import { Action } from 'redux'
import { switchMapTo, map } from 'rxjs/operators'
import { ActionsObservable, StateObservable, ofType } from 'redux-observable'
import { SetupActions } from 'rt-actions'
import { LayoutActions } from '../../layoutActions'
import { setupWorkspaces } from './openFin'
import { ApplicationEpic } from 'StoreTypes'

const setupLayout = ofType<Action>(SetupActions.setup)

export const platformEpics: Array<ApplicationEpic> = [
  (action$: ActionsObservable<Action>, _: StateObservable<any>) => {
    return action$.pipe(
      setupLayout,
      switchMapTo(setupWorkspaces().pipe(map(LayoutActions.updateContainerVisibilityAction))),
    )
  },
]
