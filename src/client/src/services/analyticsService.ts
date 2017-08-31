import { Observable } from 'rxjs/Rx'
import { ServiceBase } from '../system/service'
import { PositionsMapper } from './mappers'
import { Guard, logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'

const log = logger.create('AnalyticsService')

export default class AnalyticsService extends ServiceBase {
  _positionsMapper: any
  _schedulerService: any

  constructor(serviceType, connection, schedulerService, referenceDataService) {
    super(serviceType, connection, schedulerService)
    this._positionsMapper = new PositionsMapper(referenceDataService)
  }

  getAnalyticsStream(analyticsRequest) {
    Guard.isDefined(analyticsRequest, 'analyticsRequest required')
    return Observable.create(
      (o) => {
        log.debug('Subscribing to analytics stream')

        return this._serviceClient
          .createStreamOperation('getAnalytics', analyticsRequest)
          .retryWithPolicy(RetryPolicy.backoffTo10SecondsMax, 'getAnalytics', this._schedulerService.async)
          .map(dto => this._positionsMapper.mapFromDto(dto))
          .subscribe(o)
      },
    )
  }
}
