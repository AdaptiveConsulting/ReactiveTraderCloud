import * as _ from 'lodash'

import {
  Direction,
  Trade,
  TradeStatus,
  TradesUpdate
} from '../../types/'

export default class TradeMapper {

  mapFromDto(dto: any): TradesUpdate {
    const trades = _.map(dto.Trades, trade => this.mapFromTradeDto(trade))
    return {
      trades,
      isStateOfTheWorld: dto.IsStateOfTheWorld,
      isStale: dto.IsStale
    }
  }

  mapFromTradeDto(tradeDto: any): Trade {
    const direction = this.mapDirectionFromDto(tradeDto.Direction)
    const status = this.mapTradeStatusFromDto(tradeDto.Status)
    return createTrade(
      tradeDto.TradeId,
      tradeDto.CurrencyPair,
      tradeDto.TraderName,
      tradeDto.Notional,
      tradeDto.DealtCurrency,
      direction,
      tradeDto.SpotRate,
      new Date(tradeDto.TradeDate),
      new Date(tradeDto.ValueDate),
      status
    )
  }

  mapDirectionFromDto(directionDto: string) {
    switch (directionDto) {
      case Direction.Buy:
        return Direction.Buy
      case Direction.Sell:
        return Direction.Sell
      default:
        throw new Error(`Unknown direction ${directionDto}`)
    }
  }


  mapTradeStatusFromDto(statusDto: string) {
    switch (statusDto.toLowerCase()) {
      case TradeStatus.Pending:
        return TradeStatus.Pending
      case TradeStatus.Done:
        return TradeStatus.Done
      case TradeStatus.Rejected:
        return TradeStatus.Rejected
      default:
        throw new Error(`Unknown trade status ${statusDto}`)
    }
  }
}

function createTrade(
  tradeId,
  symbol,
  traderName,
  notional,
  dealtCurrency,
  direction,
  spotRate,
  tradeDate,
  valueDate,
  status
): Trade {
  return {
    tradeId,
    symbol,
    traderName,
    notional,
    dealtCurrency,
    direction,
    spotRate,
    tradeDate,
    valueDate,
    status
  }
}
