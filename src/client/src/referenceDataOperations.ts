import { createAction } from 'redux-actions'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from './connectionActions'
import { ReferenceDataService } from './services'

export enum ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE'
}

export const createReferenceServiceAction = createAction(
  ACTION_TYPES.REFERENCE_SERVICE
)

export const referenceServiceEpic = (
  refService$: ReferenceDataService
) => action$ => {
  return action$.pipe(
    ofType(CONNECT_SERVICES),
    switchMapTo(
      refService$
        .getCurrencyPairUpdates$()
        .pipe(
          map(createReferenceServiceAction),
          takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
        )
    )
  )
}
