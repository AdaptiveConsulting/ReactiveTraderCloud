import { Observable, Scheduler } from 'rxjs/Rx'
import { TradeMapper } from './mappers'
import { ServiceClient } from '../system/service'
import { logger, RetryPolicy } from '../system'
import '../system/observableExtensions/retryPolicyExt'
import { ServiceConst } from '../types'

const log = logger.create('BlotterService')

const createBlotterService = (connection) => {
  const serviceClient = new ServiceClient(ServiceConst.BlotterServiceKey, connection)
  const tradeMapper = new TradeMapper()
  serviceClient.connect()
  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },

    getTradesStream() {
      return Observable.create(o => {
        log.debug('Subscribing to trade stream')
        return serviceClient
          .createStreamOperation('getTradesStream', {
            /* noop request */
          })
          .retryWithPolicy(
            RetryPolicy.backoffTo10SecondsMax,
            'getTradesStream',
            Scheduler.async
          )
          .map(dto => tradeMapper.mapFromDto(dto))
          .subscribe(o)
      })
    }
  }
}
export default createBlotterService
