import { asyncScheduler } from 'rxjs'
import { map } from 'rxjs/operators'
import { RetryPolicy } from '../system'
import { retryWithPolicy } from '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { PositionsMapper } from './mappers'
import { PositionsRaw } from './mappers/positionsMapper'

export default class AnalyticsService {
  constructor(private readonly serviceClient: ServiceClient) {}

  getAnalyticsStream(analyticsRequest: string) {
    return this.serviceClient
      .createStreamOperation<PositionsRaw, string>(
        'getAnalytics',
        analyticsRequest
      )
      .pipe(
        retryWithPolicy(
          RetryPolicy.backoffTo10SecondsMax,
          'getAnalytics',
          asyncScheduler
        ),
        map(dto => PositionsMapper.mapFromDto(dto))
      )
  }
}
