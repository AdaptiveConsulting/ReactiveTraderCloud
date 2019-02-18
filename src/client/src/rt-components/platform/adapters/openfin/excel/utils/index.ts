export const formTable = {
  positions: (data: any, initialBid = 10000, initialOffer = 100000) =>
    data.map((item: any) => [item.symbol, initialBid, initialOffer, item.baseTradedAmount, item.basePnl]),
  ccy: (data: any) => data.map((item: any) => [item.symbol.slice(0, 3), item.baseTradedAmount]),
  blotter: (data: any) =>
    data.map((item: any) => [
      item.tradeId,
      item.tradeDate,
      item.direction,
      item.symbol,
      item.notional,
      ,
      item.spotRate,
      item.status,
      item.valueDate,
      item.traderName,
    ]),
}
