import { Action } from 'redux'
import { ofType } from 'redux-observable'

import { ignoreElements, tap } from 'rxjs/operators'
import { SHELL_ACTION_TYPES, ShellActions } from 'shell'
import { ApplicationEpic } from 'StoreTypes'

const { openLink } = ShellActions
type OpenLinkAction = ReturnType<typeof openLink>

export const openLinkWithOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, OpenLinkAction>(SHELL_ACTION_TYPES.OPEN_LINK),
    tap(link => openFin.openLink(link.payload)),
    ignoreElements()
  )
