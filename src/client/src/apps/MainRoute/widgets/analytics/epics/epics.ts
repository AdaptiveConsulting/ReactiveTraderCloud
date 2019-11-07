import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { applicationDisconnected, REF_ACTION_TYPES, ReferenceActions } from 'rt-actions'
import { combineLatest, map, mergeMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { ANALYTICS_ACTION_TYPES, AnalyticsActions } from '../actions'
import AnalyticsService from '../analyticsService'
import { ServiceStubWithLoadBalancer } from 'rt-system'

const CURRENCY: string = 'USD'

const { fetchAnalytics, subcribeToAnalytics } = AnalyticsActions
const { createReferenceServiceAction } = ReferenceActions
type ReferenceServiceAction = ReturnType<typeof createReferenceServiceAction>
type FetchAnalyticsAction = ReturnType<typeof fetchAnalytics>
type SubscribeToAnalyticsAction = ReturnType<typeof subcribeToAnalytics>

export const analyticsServiceEpic: ApplicationEpic<{
  loadBalancedServiceStub: ServiceStubWithLoadBalancer
}> = (action$, $state, { loadBalancedServiceStub }) => {
  const analyticsService = new AnalyticsService(loadBalancedServiceStub)

  const refAction$ = action$.pipe(
    ofType<Action, ReferenceServiceAction>(REF_ACTION_TYPES.REFERENCE_SERVICE),
  )

  const subscribeAction$ = action$.pipe(
    ofType<Action, SubscribeToAnalyticsAction>(ANALYTICS_ACTION_TYPES.SUBCRIBE_TO_ANALYTICS),
  )

  const combined$ = refAction$.pipe(combineLatest(subscribeAction$))

  return combined$.pipe(
    mergeMapTo<FetchAnalyticsAction>(
      analyticsService.getAnalyticsStream(CURRENCY).pipe(
        map(fetchAnalytics),
        takeUntil(action$.pipe(applicationDisconnected)),
      ),
    ),
  )
}
