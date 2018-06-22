import { map, retryWhen } from 'rxjs/operators'
import { logger, retryConstantly, ServiceClient } from '../system'
import { ServiceConst } from '../types'
import { mapFromDto } from './mappers'
import { RawTradeUpdate } from './mappers/tradeMapper'

const log = logger.create('BlotterService')

export default class BlotterService {
  constructor(private readonly serviceClient: ServiceClient) {}

  getTradesStream() {
    log.info('Subscribing to blotter stream')
    return this.serviceClient
      .createStreamOperation<RawTradeUpdate>(ServiceConst.BlotterServiceKey, 'getTradesStream', {})
      .pipe(
        retryWhen(retryConstantly({ interval: 3000 })),
        map(dto => mapFromDto(dto))
      )
  }
}
