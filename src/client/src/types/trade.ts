import { CurrencyPair } from './'

export interface Trade {
  tradeId: number,
  traderName: string,
  currencyPair: CurrencyPair,
  notional: number,
  dealtCurrency: string,
  direction: any,
  spotRate: number,
  tradeDate: Date,
  valueDate: Date,
  status: any,
}
