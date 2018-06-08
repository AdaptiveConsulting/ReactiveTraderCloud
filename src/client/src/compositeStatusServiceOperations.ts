import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { action as createAction } from './ActionHelper'
import { ApplicationEpic } from './ApplicationEpic'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from './connectionActions'
import { ServiceConnectionInfo } from './system'

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const createCompositeStatusServiceAction = createAction<
  typeof ACTION_TYPES.COMPOSITE_STATUS_SERVICE,
  ServiceConnectionInfo
>(ACTION_TYPES.COMPOSITE_STATUS_SERVICE)

export const compositeStatusServiceEpic: ApplicationEpic = (action$, store, { compositeStatusService }) =>
  action$.pipe(
    ofType(CONNECT_SERVICES),
    switchMapTo(
      compositeStatusService.serviceStatusStream.pipe(
        map(createCompositeStatusServiceAction),
        takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
      )
    )
  )

export default function(
  state: ServiceConnectionInfo = {},
  action: ReturnType<typeof createCompositeStatusServiceAction> | Action<typeof DISCONNECT_SERVICES>
) {
  switch (action.type) {
    case ACTION_TYPES.COMPOSITE_STATUS_SERVICE:
      return action.payload
    case DISCONNECT_SERVICES:
      return {}
    default:
      return state
  }
}
