import { map, retryWhen } from 'rxjs/operators'

import { logger, retryConstantly, ServiceClient } from 'rt-system'
import { Trade } from 'rt-types'
import { mapFromTradeDto, RawTradeUpdate } from 'rt-types'

const log = logger.create('BlotterService')

export interface TradesUpdate {
  readonly isStateOfTheWorld: boolean
  readonly isStale: boolean
  readonly trades: Trade[]
}

function mapFromDto(dto: RawTradeUpdate): TradesUpdate {
  const trades = dto.Trades.map<Trade>(trade => mapFromTradeDto(trade))
  return {
    trades,
    isStateOfTheWorld: dto.IsStateOfTheWorld,
    isStale: dto.IsStale
  }
}

export default class BlotterService {
  constructor(private readonly serviceClient: ServiceClient) {}

  getTradesStream() {
    log.info('Subscribing to blotter stream')
    return this.serviceClient.createStreamOperation<RawTradeUpdate>('blotter', 'getTradesStream', {}).pipe(
      retryWhen(retryConstantly({ interval: 3000 })),
      map(dto => mapFromDto(dto))
    )
  }
}
