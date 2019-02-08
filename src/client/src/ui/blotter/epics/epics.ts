import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { combineLatest, map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { BLOTTER_ACTION_TYPES, BlotterActions } from '../actions'
import BlotterService from '../blotterService'
type SubscribeToBlotterAction = ReturnType<typeof BlotterActions.subscribeToBlotterAction>

const { createNewTradesAction } = BlotterActions

export const blotterServiceEpic: ApplicationEpic = (action$, state$, { loadBalancedServiceStub }) => {
  const blotterService = new BlotterService(loadBalancedServiceStub)

  const connectAction$ = action$.pipe(applicationConnected)

  const subscribeAction$ = action$.pipe(
    ofType<Action, SubscribeToBlotterAction>(BLOTTER_ACTION_TYPES.SUBSCRIBE_TO_BLOTTER_ACTION),
  )

  const combined$ = connectAction$.pipe(combineLatest(subscribeAction$))

  return combined$.pipe(
    switchMapTo(
      blotterService.getTradesStream().pipe(
        map(createNewTradesAction),
        takeUntil(action$.pipe(applicationDisconnected)),
      ),
    ),
  )
}
