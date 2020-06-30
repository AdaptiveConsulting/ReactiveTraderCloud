import { map, retryWhen } from 'rxjs/operators'

import { ServiceClient, retryWithBackOff } from 'rt-system'
import { Trade } from 'rt-types'
import { mapFromTradeDto, RawTradeUpdate } from 'rt-types'
import { defer } from 'rxjs'
export interface TradesUpdate {
  readonly isStateOfTheWorld: boolean
  readonly isStale: boolean
  readonly trades: Trade[]
}

export interface HighlightRow {
  trades: Trade[]
}

function mapFromDto(dto: RawTradeUpdate): TradesUpdate {
  const trades = dto.Trades.map<Trade>(trade => mapFromTradeDto(trade))
  return {
    trades,
    isStateOfTheWorld: dto.IsStateOfTheWorld,
    isStale: dto.IsStale,
  }
}

const LOG_NAME = 'Blotter Service:'

export default function (serviceClient: ServiceClient) {
  return defer(() => {
    console.info(LOG_NAME, 'Subscribing to blotter stream')

    return serviceClient
      .createStreamOperation<RawTradeUpdate>('blotter', 'getTradesStream', {})
      .pipe(
        retryWhen(retryWithBackOff()),
        map(dto => mapFromDto(dto))
      )
  })
}
