import { Observable, Scheduler } from 'rxjs/Rx'
import { ServiceClient } from '../system/service'
import { PositionsMapper } from './mappers'
import { Guard, logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'
import { ServiceConst } from '../types'

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
          .retryWithPolicy(
            RetryPolicy.backoffTo10SecondsMax,
            'getAnalytics',
            Scheduler.async
          )
          .map(dto => positionsMapper.mapFromDto(dto))
          .subscribe(o)
      })
    }
  }
}
