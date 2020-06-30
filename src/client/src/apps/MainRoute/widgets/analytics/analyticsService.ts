import {
  compositeStatusService,
  referenceDataService$,
  serviceClient,
} from 'apps/MainRoute/store/singleServices'
import { ServiceConnectionStatus } from 'rt-types'
import { filter, map, mergeMapTo, shareReplay, startWith } from 'rxjs/operators'
import AnalyticsService from './analyticsAPI'
import { getModel } from './model/AnalyticsLineChartModel'
import { getPositionsChartModel } from './model/positionsChartModel'

const ANALYTICS = 'analytics'
const CURRENCY: string = 'USD'
export const analyticsConnection$ = compositeStatusService.serviceStatusStream.pipe(
  filter(statusMap => !!statusMap[ANALYTICS]),
  map(statusMap => statusMap[ANALYTICS].connectionStatus),
  startWith(ServiceConnectionStatus.CONNECTING),
  shareReplay(1)
)

export const analyticsService$ = new AnalyticsService(serviceClient)
  .getAnalyticsStream(CURRENCY)
  .pipe(shareReplay(1))

export const history$ = referenceDataService$.pipe(
  mergeMapTo(analyticsService$),
  map(x => getModel(x.history))
)
export const positions$ = referenceDataService$.pipe(
  mergeMapTo(analyticsService$),
  map(x => getPositionsChartModel(x.currentPositions))
)
