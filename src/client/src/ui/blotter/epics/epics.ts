import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { combineLatest, map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../connectionStatus'
import { ACTION_TYPES as BLOTTER_ACTION_TYPES, BlotterActions } from '../actions'
import BlotterService from '../blotterService'
type SubscribeToBLotterAction = ReturnType<typeof BlotterActions.subscribeToBlotterAction>

const { createNewTradesAction } = BlotterActions

export const blotterServiceEpic: ApplicationEpic = (action$, state$, { loadBalancedServiceStub }) => {
  const blotterService = new BlotterService(loadBalancedServiceStub)

  const connectAction$ = action$.pipe(applicationConnected)

  const subscribeAction$ = action$.pipe(
    ofType<Action, SubscribeToBLotterAction>(BLOTTER_ACTION_TYPES.SUBSCRIBE_TO_BLOTTER_ACTION)
  )

  const combined$ = connectAction$.pipe(combineLatest(subscribeAction$))

  return combined$.pipe(
    switchMapTo(
      blotterService.getTradesStream().pipe(
        map(createNewTradesAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
}
