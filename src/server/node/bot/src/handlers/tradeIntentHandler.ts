import { Trade } from 'generated/TradingGateway'
import { EMPTY } from 'rxjs'
import { catchError, filter, map, mergeMap, scan, withLatestFrom } from 'rxjs/operators'
import { trades$, IntentNumberParameter, IntentStringParameter } from '../services'
import { formatDateTime } from '../utils'
import logger from '../logger'
import { tradeUpdateMessage } from '../messages'
import { Handler } from './'

interface TradeIntentFields {
  number?: IntentNumberParameter
  CurrencyPairs?: IntentStringParameter
  Currency?: IntentStringParameter
}

const INTENT_TRADES_INFO = 'rt.trades.info'

const sortPrices = (prices: Trade[]) =>
  prices.sort((a, b) => {
    return a.tradeDate < b.tradeDate ? -1 : a.tradeDate > b.tradeDate ? 1 : 0
  })

const tradeIntentHandler: Handler = (symphony, { intentsFromDF$ }) => {
  const latestTrades$ = trades$.pipe(
    map(tradeUpdate => tradeUpdate.updates),
    scan<Trade[], Map<number, Trade>>((acc, trades) => {
      trades.forEach(trade => acc.set(Number(trade.tradeId), trade))
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
          filteredTrades = filteredTrades.filter(x => x.currencyPair === ccyPair)
        }

        if (ccy) {
          filteredTrades = filteredTrades.filter(x => x.currencyPair.substr(0, 3) === ccy)
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
      }),
      catchError(e => {
        logger.error('Error processing trade reply', e)
        return EMPTY
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
