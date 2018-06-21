import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES, FooterActions } from './actions'

const { openLink } = FooterActions
type OpenLinkAction = ReturnType<typeof openLink>

export const linkEpic: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, OpenLinkAction>(ACTION_TYPES.OPEN_LINK),
    tap(link => !state$.value.environment.isRunningOnDesktop && window.open(link.payload, '_blank')),
    ignoreElements()
  )
