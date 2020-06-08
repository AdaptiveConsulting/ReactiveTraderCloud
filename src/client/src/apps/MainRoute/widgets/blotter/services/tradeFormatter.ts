import { DateTime } from 'luxon'
import numeral from 'numeral'
import { CurrencyPair, Trade } from 'rt-types'
export const formatTradeNotification = (trade: Trade, currencyPair: CurrencyPair) => ({
  symbol: trade.symbol,
  spotRate: trade.spotRate,
  notional: numeral(trade.notional).format('0,000,000[.]00'),
  direction: trade.direction,
  tradeId: trade.tradeId.toString(),
  tradeDate: DateTime.fromJSDate(trade.tradeDate).toString(),
  status: trade.status,
  dealtCurrency: trade.dealtCurrency,
  termsCurrency: currencyPair.terms,
  valueDate: DateTime.fromJSDate(trade.valueDate, { zone: 'utc' }).toFormat('dd MMM'),
  traderName: trade.traderName,
})
