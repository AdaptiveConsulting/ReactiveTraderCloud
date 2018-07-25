import { CollectionUpdates, Direction, Trade, TradeStatus } from 'rt-types'

export interface TradeRaw {
  TradeId: number
  CurrencyPair: string
  TraderName: string
  Notional: number
  DealtCurrency: string
  Direction: string
  Status: string
  SpotRate: number
  TradeDate: string
  ValueDate: string
}

export interface RawTradeUpdate extends CollectionUpdates {
  Trades: TradeRaw[]
}

export function mapFromTradeDto(tradeDto: TradeRaw): Trade {
  const direction = mapDirectionFromDto(tradeDto.Direction)
  const status = mapTradeStatusFromDto(tradeDto.Status)
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

export function mapDirectionFromDto(directionDto: string) {
  switch (directionDto) {
    case Direction.Buy:
      return Direction.Buy
    case Direction.Sell:
      return Direction.Sell
    default:
      throw new Error(`Unknown direction ${directionDto}`)
  }
}

export function mapTradeStatusFromDto(statusDto: string) {
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

function createTrade(
  tradeId: number,
  symbol: string,
  traderName: string,
  notional: number,
  dealtCurrency: string,
  direction: string,
  spotRate: number,
  tradeDate: Date,
  valueDate: Date,
  status: string
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
