import { Observable, Scheduler } from 'rxjs/Rx'
import { ServiceBase } from '../system/service'
import { PositionsMapper } from './mappers'
import { Guard, logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'
import { ServiceConst } from '../types'

const log = logger.create('AnalyticsService')

export default class AnalyticsService extends ServiceBase {
  positionsMapper: any

  constructor(connection, referenceDataService) {
    super(ServiceConst.AnalyticsServiceKey, connection)
    this.positionsMapper = new PositionsMapper(referenceDataService)
    this.connect()
  }

  getAnalyticsStream(analyticsRequest) {
    Guard.isDefined(analyticsRequest, 'analyticsRequest required')
    return Observable.create(o => {
      log.debug('Subscribing to analytics stream')

      return this.serviceClient
        .createStreamOperation('getAnalytics', analyticsRequest)
        .retryWithPolicy(
          RetryPolicy.backoffTo10SecondsMax,
          'getAnalytics',
          Scheduler.async
        )
        .map(dto => this.positionsMapper.mapFromDto(dto))
        .subscribe(o)
    })
  }
}
