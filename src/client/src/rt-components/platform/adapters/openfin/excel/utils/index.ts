import { Trade, CurrencyPairPosition } from 'rt-types'

export const formTable = {
  positions: (data: CurrencyPairPosition[], initialBid = 10000, initialOffer = 100000) =>
    data.map((item: CurrencyPairPosition) => [
      item.symbol,
      initialBid,
      initialOffer,
      item.baseTradedAmount,
      item.basePnl,
    ]),
  ccy: (data: CurrencyPairPosition[]) =>
    data.map((item: CurrencyPairPosition) => [item.symbol.slice(0, 3), item.baseTradedAmount]),
  blotter: (data: Trade[]) =>
    data.map((item: Trade) => [
      item.tradeId,
      item.tradeDate,
      item.direction,
      item.symbol,
      item.notional,
      item.spotRate,
      item.status,
      item.valueDate,
      item.traderName,
    ]),
}
