import { filter, map, mergeMap, scan, withLatestFrom } from 'rxjs/operators'
import { formatDateTime, Trade } from '../domain'
import logger from '../logger'
import { tradeUpdateMessage } from '../messages'
import { IntentNumberParameter, IntentStringParameter } from '../nlp-services'
import { Handler } from './'

interface TradeIntentFields {
  number?: IntentNumberParameter
  CurrencyPairs?: IntentStringParameter
  Currency?: IntentStringParameter
}

const INTENT_TRADES_INFO = 'rt.trades.info'

const sortPrices = (prices: Trade[]) =>
  prices.sort((a, b) => {
    return a.TradeDate < b.TradeDate ? -1 : a.TradeDate > b.TradeDate ? 1 : 0
  })

const tradeIntentHandler: Handler = (symphony, { intentsFromDF$ }, { tradeStream$ }) => {
  const latestTrades$ = tradeStream$.pipe(
    map(tradeUpdate => tradeUpdate.Trades),
    scan<Trade[], Map<number, Trade>>((acc, trades) => {
      trades.forEach(trade => acc.set(trade.TradeId, trade))
      return acc
    }, new Map<number, Trade>()),
    map(trades => Array.from(trades.values()).reverse())
  )

  const subscription$ = intentsFromDF$
    .pipe(
      filter(x => x.intentResponse.queryResult.intent.displayName === INTENT_TRADES_INFO),
      withLatestFrom(latestTrades$),
      mergeMap(([request, trades]) => {
        const fields: TradeIntentFields = request.intentResponse.queryResult.parameters.fields
        const count = fields.number && fields.number.numberValue ? fields.number.numberValue : 20
        const ccyPair = fields.CurrencyPairs ? fields.CurrencyPairs.stringValue : ''
        const ccy = fields.Currency ? fields.Currency.stringValue : ''

        let filteredTrades = trades

        if (ccyPair) {
          filteredTrades = filteredTrades.filter(x => x.CurrencyPair === ccyPair)
        }

        if (ccy) {
          filteredTrades = filteredTrades.filter(x => x.CurrencyPair.substr(0, 3) === ccy)
        }

        const field = ccyPair || ccy

        filteredTrades = filteredTrades.slice(0, count)

        const label = `Here are your last ${count} ${field || ''} trades as of ${formatDateTime(
          new Date()
        )}`

        return symphony.sendMessage(
          request.originalMessage.stream.streamId,
          tradeUpdateMessage(filteredTrades, label)
        )
      })
    )
    .subscribe(
      value => {
        logger.info('Trades sent to Symphony user', value)
      },
      error => {
        logger.error('Error processing trade reply', error)
      }
    )

  return () => {
    subscription$.unsubscribe()
    logger.info('disposed trades')
  }
}

export default tradeIntentHandler
