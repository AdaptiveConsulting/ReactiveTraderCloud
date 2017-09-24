import { Observable, Scheduler } from 'rxjs/Rx'
import { TradeMapper } from './mappers'
import { ServiceBase } from '../system/service'
import { logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'
import { ServiceConst } from '../types'

const log = logger.create('BlotterService')

export default class BlotterService extends ServiceBase {
  tradeMapper: any
  constructor(connection, referenceDataService) {
    super(ServiceConst.BlotterServiceKey, connection)
    // this.serviceClient = new ServiceClient(
    //   ServiceConst.BlotterServiceKey,
    //   connection
    // )
    this.tradeMapper = new TradeMapper(referenceDataService)
    this.connect()
    // this.serviceClient.connect()
  }

  get serviceStatusStream() {
    return this.serviceClient.serviceStatusStream
  }

  getTradesStream() {
    return Observable.create(o => {
      log.debug('Subscribing to trade stream')
      return this.serviceClient
        .createStreamOperation('getTradesStream', {
          /* noop request */
        })
        .retryWithPolicy(
          RetryPolicy.backoffTo10SecondsMax,
          'getTradesStream',
          Scheduler.async
        )
        .map(dto => this.tradeMapper.mapFromDto(dto))
        .subscribe(o)
    })
  }
}
