import { Observable } from 'rxjs/Rx'
import { TradeMapper } from './mappers'
import { ServiceBase } from '../system/service'
import { logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'

const log = logger.create('BlotterService')

export default class BlotterService extends ServiceBase {
  _tradeMapper: any
  _schedulerService: any
  constructor(serviceType,
              connection,
              schedulerService,
              referenceDataService) {
    super(serviceType, connection, schedulerService)
    this._tradeMapper = new TradeMapper(referenceDataService)
  }

  getTradesStream() {
    return Observable.create(
      (o) => {
        log.debug('Subscribing to trade stream')
        return this._serviceClient
          .createStreamOperation('getTradesStream', { /* noop request */ })
          .retryWithPolicy(RetryPolicy.backoffTo10SecondsMax, 'getTradesStream', this._schedulerService.async)
          .map(dto => this._tradeMapper.mapFromDto(dto))
          .subscribe(o)
      },
    )
  }
}
