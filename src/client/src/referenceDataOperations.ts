import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { action } from './ActionHelper'
import { ApplicationEpic } from './ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES } from './operations/connectionStatus'
import { CurrencyPair } from './types'

export enum ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE'
}

export const createReferenceServiceAction = action<typeof ACTION_TYPES.REFERENCE_SERVICE, Map<string, CurrencyPair>>(
  ACTION_TYPES.REFERENCE_SERVICE
)

export type ReferenceServiceAction = ReturnType<typeof createReferenceServiceAction>

export const referenceServiceEpic: ApplicationEpic = (action$, store, { referenceDataService }) => {
  return action$.pipe(
    ofType(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      referenceDataService.getCurrencyPairUpdates$().pipe(
        map(createReferenceServiceAction),
        takeUntil(action$.pipe(ofType(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
      )
    )
  )
}
