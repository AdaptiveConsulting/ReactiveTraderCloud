import { map } from 'rxjs/operators'
import { Observable, Scheduler } from 'rxjs'
import { Guard, logger, RetryPolicy } from '../system'
import { retryWithPolicy } from '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { ServiceConst } from '../types'
import { PositionsMapper } from './mappers'

const log = logger.create('AnalyticsService')

export default function analyticsService(
  connection,
  referenceDataService
): Object {
  const serviceClient = new ServiceClient(
    ServiceConst.AnalyticsServiceKey,
    connection
  )
  const positionsMapper = new PositionsMapper(referenceDataService)
  serviceClient.connect()
  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    getAnalyticsStream(analyticsRequest) {
      Guard.isDefined(analyticsRequest, 'analyticsRequest required')
      return Observable.create(o => {
        log.debug('Subscribing to analytics stream')

        return serviceClient
          .createStreamOperation('getAnalytics', analyticsRequest)
          .pipe(
            retryWithPolicy(
              RetryPolicy.backoffTo10SecondsMax,
              'getAnalytics',
              Scheduler.async
            ),
            map(dto => positionsMapper.mapFromDto(dto))
          )
          .subscribe(o)
      })
    }
  }
}
