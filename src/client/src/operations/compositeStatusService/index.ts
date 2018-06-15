import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { action as createAction } from '../../ActionHelper'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../connectionActions'
import { ServiceConnectionInfo } from '../../system'

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const createCompositeStatusServiceAction = createAction<
  typeof ACTION_TYPES.COMPOSITE_STATUS_SERVICE,
  ServiceConnectionInfo
>(ACTION_TYPES.COMPOSITE_STATUS_SERVICE)

export const compositeStatusServiceEpic: ApplicationEpic = (action$, store, { compositeStatusService }) =>
  action$.pipe(
    ofType(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      compositeStatusService.serviceStatusStream.pipe(
        map(createCompositeStatusServiceAction),
        takeUntil(action$.pipe(ofType(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
      )
    )
  )

export function compositeStatusServiceReducer(
  state: ServiceConnectionInfo = {},
  action: ReturnType<typeof createCompositeStatusServiceAction> | DisconnectAction
) {
  switch (action.type) {
    case ACTION_TYPES.COMPOSITE_STATUS_SERVICE:
      return action.payload
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return {}
    default:
      return state
  }
}
