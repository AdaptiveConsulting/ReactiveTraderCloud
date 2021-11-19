import { EMPTY, from } from 'rxjs'
import { catchError, concatMap, filter, map, mergeMap, switchMap, take } from 'rxjs/operators'
import { trades$, IntentNumberParameter, IntentStringParameter } from '../services'
import { formatNumber } from '../utils/priceFormatting'
import logger from '../logger'
import { tradeUpdateMessage } from '../messages'
import { standardMessage } from '../messages/standardMessage'
import { Handler } from './'

interface TradeIntentFields {
  notional: IntentNumberParameter
  CurrencyPairs?: IntentStringParameter
  Currency?: IntentStringParameter
}

const INTENT_TRADES_NOTIFICATION = 'rt.trades.notification'

const tradeNotificationHandler: Handler = (symphony, { intentsFromDF$ }) => {
  const latestTrades$ = trades$.pipe(
    filter(t => t.isStateOfTheWorld === false),
    map(tradeUpdate => tradeUpdate.updates),
    mergeMap(trades => from(trades)),
    filter(trade => trade.status === 'Done')
  )

  const subscription$ = intentsFromDF$
    .pipe(
      filter(x => x.intentResponse.queryResult.intent.displayName === INTENT_TRADES_NOTIFICATION),
      switchMap(request => {
        const fields: TradeIntentFields = request.intentResponse.queryResult.parameters.fields
        const notional = fields.notional.numberValue
        const ccyPair = fields.CurrencyPairs ? fields.CurrencyPairs.stringValue : undefined

        const ccy = fields.Currency ? fields.Currency.stringValue : undefined

        const updateMessage = `Notification Setup: We will let you know when any ${ccyPair ||
          ccy ||
          ''} trade over ${formatNumber(notional)} is executed`
        const notifcationMessage = `Notification: A ${ccyPair ||
          ccy ||
          ''} trade over ${formatNumber(notional)} was executed`
        return symphony
          .sendMessage(request.originalMessage.stream.streamId, standardMessage(updateMessage))
          .pipe(
            concatMap(() =>
              latestTrades$.pipe(
                filter(trade => {
                  if (notional > trade.notional) {
                    return false
                  }

                  if (ccyPair) {
                    return trade.currencyPair === ccyPair
                  }

                  if (ccy) {
                    return trade.currencyPair.substr(0, 3) === ccy
                  }

                  return true
                }),
                mergeMap(trade =>
                  symphony.sendMessage(
                    request.originalMessage.stream.streamId,
                    tradeUpdateMessage([trade], notifcationMessage, 'HIGH')
                  )
                ),
                take(5)
              )
            )
          )
      }),
      catchError(e => {
        logger.error('Error processing trade reply', e)
        return EMPTY
      })
    )
    .subscribe(
      value => {
        logger.info('Trades sent to Symphony user')
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

export default tradeNotificationHandler
