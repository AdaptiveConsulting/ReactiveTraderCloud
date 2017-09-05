import * as _ from 'lodash'

import Trade from '../model/trade'
import TradesUpdate from '../model/tradesUpdate'
import ReferenceDataService from '../referenceDataService'
import { Direction, TradeStatus } from '../model/index'

export default class TradeMapper {

  _referenceDataService: ReferenceDataService

  constructor(referenceDataService: ReferenceDataService) {
    this._referenceDataService = referenceDataService
  }

  mapFromDto(dto: any) {
    const trades = _.map(dto.Trades, trade => this.mapFromTradeDto(trade))
    return new TradesUpdate(dto.IsStateOfTheWorld, dto.IsStale, trades)
  }

  mapFromTradeDto(tradeDto: any): Trade {
    const direction = this._mapDirectionFromDto(tradeDto.Direction)
    const status = this._mapTradeStatusFromDto(tradeDto.Status)
    const currencyPair = this._referenceDataService.getCurrencyPair(tradeDto.CurrencyPair)
    return new Trade(
      tradeDto.TradeId,
      tradeDto.TraderName,
      currencyPair,
      tradeDto.Notional,
      tradeDto.DealtCurrency,
      direction,
      tradeDto.SpotRate,
      new Date(tradeDto.TradeDate),
      new Date(tradeDto.ValueDate),
      status,
    )
  }

  _mapDirectionFromDto(directionDto: string) {
    switch (directionDto) {
      case Direction.Buy.name:
        return Direction.Buy
      case Direction.Sell.name:
        return Direction.Sell
      default:
        throw new Error(`Unknown direction ${directionDto}`)
    }
  }

  _mapTradeStatusFromDto(statusDto: string) {
    switch (statusDto) {
      case TradeStatus.Pending.name:
        return TradeStatus.Pending
      case TradeStatus.Done.name:
        return TradeStatus.Done
      case TradeStatus.Rejected.name:
        return TradeStatus.Rejected
      default:
        throw new Error(`Unknown trade status ${statusDto}`)
    }
  }
}
