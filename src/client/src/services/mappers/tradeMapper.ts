import * as _ from 'lodash'

import {
  Trade,
  Direction,
  TradeStatus,
  TradesUpdate,
  ReferenceDataService
} from '../../types/'

export default class TradeMapper {
  referenceDataService: ReferenceDataService

  constructor(referenceDataService: ReferenceDataService) {
    this.referenceDataService = referenceDataService
  }

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
    const currencyPair = this.referenceDataService.getCurrencyPair(
      tradeDto.CurrencyPair
    )
    return createTrade(
      tradeDto.TradeId,
      tradeDto.TraderName,
      currencyPair,
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
  traderName,
  currencyPair,
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
    traderName,
    currencyPair,
    notional,
    dealtCurrency,
    direction,
    spotRate,
    tradeDate,
    valueDate,
    status
  }
}
