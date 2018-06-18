import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, ConnectAction, DisconnectAction } from '../connectionStatus'
import { ReferenceActions } from './actions'

const { createReferenceServiceAction } = ReferenceActions
type ReferenceServiceAction = ReturnType<typeof createReferenceServiceAction>

export const referenceServiceEpic: ApplicationEpic = (action$, state$, { referenceDataService }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo<ReferenceServiceAction>(
      referenceDataService.getCurrencyPairUpdates$().pipe(
        map(createReferenceServiceAction),
        takeUntil(action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
      )
    )
  )
