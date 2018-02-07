export interface Trade {
  tradeId: number,
  traderName: string,
  symbol: string,
  notional: number,
  dealtCurrency: string,
  direction: any,
  spotRate: number,
  tradeDate: Date,
  valueDate: Date,
  status: any,
}
