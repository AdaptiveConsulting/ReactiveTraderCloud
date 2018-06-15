import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import {
  ACTION_TYPES as CONNECTION_ACTION_TYPES,
  ConnectAction,
  DisconnectAction
} from '../../operations/connectionStatus'
import { BlotterActions } from './actions'

const { createNewTradesAction } = BlotterActions
type NewTradesAction = ReturnType<typeof createNewTradesAction>

export const blotterServiceEpic: ApplicationEpic = (action$, state$, { blotterService }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      blotterService.getTradesStream().pipe(
        map(createNewTradesAction),
        takeUntil<NewTradesAction>(
          action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES))
        )
      )
    )
  )

export default blotterServiceEpic
