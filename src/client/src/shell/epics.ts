import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'

import { ApplicationEpic } from 'ApplicationEpic'

import { SHELL_ACTION_TYPES, ShellActions } from './actions'

const { openLink } = ShellActions

type OpenLinkAction = ReturnType<typeof openLink>

export const linkEpic: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, OpenLinkAction>(SHELL_ACTION_TYPES.OPEN_LINK),
    tap(link => console.log({ link }) || window.open(link.payload, '_blank')),
    ignoreElements()
  )
