import { asyncScheduler } from 'rxjs'
import { map } from 'rxjs/operators'
import { logger, RetryPolicy } from '../system'
import { retryWithPolicy } from '../system/observableExtensions/retryPolicyExt'
import { ServiceClient } from '../system/service'
import { Connection } from '../system/service/connection'
import { ServiceConst, TradesUpdate } from '../types'
import { mapFromDto } from './mappers'
import { RawTradeUpdate } from './mappers/tradeMapper'

const log = logger.create('BlotterService')

const createBlotterService = (connection: Connection) => {
  const serviceClient = new ServiceClient(
    ServiceConst.BlotterServiceKey,
    connection
  )
  serviceClient.connect()
  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },

    getTradesStream() {
      log.debug('Subscribing to trade stream')
      return serviceClient
        .createStreamOperation<RawTradeUpdate, {}>('getTradesStream', {})
        .pipe(
          retryWithPolicy(
            RetryPolicy.backoffTo10SecondsMax,
            'getTradesStream',
            asyncScheduler
          ),
          map(dto => mapFromDto(dto))
        )
    }
  }
}
export default createBlotterService
