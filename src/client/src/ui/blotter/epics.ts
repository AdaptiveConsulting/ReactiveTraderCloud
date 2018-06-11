import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { CONNECT_SERVICES, ConnectAction, DISCONNECT_SERVICES, DisconnectAction } from '../../connectionActions'
import { TradesUpdate } from '../../types'
import { BlotterActions } from './actions'

type NewTradesAction = ReturnType<typeof BlotterActions.createNewTradesAction>

export const blotterServiceEpic: ApplicationEpic = (action$, state$, { blotterService }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECT_SERVICES),
    switchMapTo<NewTradesAction>(
      blotterService.getTradesStream().pipe(
        map<TradesUpdate, NewTradesAction>(BlotterActions.createNewTradesAction),
        takeUntil<NewTradesAction>(action$.pipe(ofType<Action, DisconnectAction>(DISCONNECT_SERVICES)))
      )
    )
  )

export default blotterServiceEpic
