import { Trade, CurrencyPairPosition, CurrencyPairPositionWithPrice } from 'rt-types'

export const formTable = {
  positions: (data: CurrencyPairPositionWithPrice[]) =>
    data.map((item: CurrencyPairPositionWithPrice) => [
      item.symbol,
      item.latestBid,
      item.latestAsk,
      item.baseTradedAmount,
      item.basePnl,
    ]),
  ccy: (data: CurrencyPairPosition[]) => {
    const positionsMap = data.reduce(
      (acc, item) => {
        const base = item.symbol.slice(0, 3)
        const prevPosition = acc[base] || 0
        return { ...acc, [base]: prevPosition + item.baseTradedAmount }
      },
      {} as { [ccy: string]: number },
    )
    return Object.keys(positionsMap).map(ccy => [ccy, positionsMap[ccy]] as [string, number])
  },
  blotter: (data: Array<Partial<Trade>>) => {
    return data
      .sort((a, b) => {
        if (typeof b.tradeId === 'undefined' || typeof a.tradeId === 'undefined') {
          return 0
        }
        return b.tradeId - a.tradeId
      }) // Sort by most recent trades first
      .map((item: Partial<Trade>) => [
        item.tradeId,
        item.tradeDate,
        item.direction,
        item.symbol,
        item.notional,
        item.dealtCurrency,
        item.spotRate,
        item.status,
        item.valueDate,
        item.traderName,
      ])
  },
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
