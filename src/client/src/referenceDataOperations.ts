import { createAction } from 'redux-actions'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from './ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES } from './connectionActions'
import { CurrencyPair } from './types'

export enum ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE'
}

export const createReferenceServiceAction = createAction<Map<string, CurrencyPair>>(ACTION_TYPES.REFERENCE_SERVICE)

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
