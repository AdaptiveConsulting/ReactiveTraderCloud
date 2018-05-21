import { createAction, handleActions } from 'redux-actions'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from './ApplicationEpic'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from './connectionActions'

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const createCompositeStatusServiceAction = createAction(ACTION_TYPES.COMPOSITE_STATUS_SERVICE)

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

export default handleActions(
  {
    [ACTION_TYPES.COMPOSITE_STATUS_SERVICE]: (state, action) => action.payload,
    [DISCONNECT_SERVICES]: (state, action) => ({})
  },
  {}
)
