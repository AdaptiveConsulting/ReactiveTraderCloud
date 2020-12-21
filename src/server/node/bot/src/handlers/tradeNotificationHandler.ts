import { concat, from } from 'rxjs'
import { concatMap, filter, map, mergeMap, switchMap, take } from 'rxjs/operators'
import { formatNumber } from '../domain/priceFormatting'
import logger from '../logger'
import { tradeUpdateMessage } from '../messages'
import { standardMessage } from '../messages/standardMessage'
import { IntentNumberParameter, IntentStringParameter } from '../nlp-services'
import { Handler } from './'

interface TradeIntentFields {
  notional: IntentNumberParameter
  CurrencyPairs?: IntentStringParameter
  Currency?: IntentStringParameter
}

const INTENT_TRADES_NOTIFICATION = 'rt.trades.notification'

const tradeNotificationHandler: Handler = (
  symphony,
  { intentsFromDF$ },
  { tradeStream$ }
) => {
  const latestTrades$ = tradeStream$.pipe(
    filter(t => t.IsStateOfTheWorld === false),
    map(tradeUpdate => tradeUpdate.Trades),
    mergeMap(trades => from(trades)),
    filter(trade => trade.Status === 'Done')
  )

  const subscription$ = intentsFromDF$
    .pipe(
      filter(x => x.intentResponse.queryResult.intent.displayName === INTENT_TRADES_NOTIFICATION),
      switchMap(request => {
        const fields: TradeIntentFields = request.intentResponse.queryResult.parameters.fields
        const notional = fields.notional.numberValue
        const ccyPair = fields.CurrencyPairs ? fields.CurrencyPairs.stringValue : undefined

        const ccy = fields.Currency ? fields.Currency.stringValue : undefined

        const updateMessage = `Notification Setup: We will let you know when any ${
          ccyPair || ccy || ''
        } trade over ${formatNumber(notional)} is executed`
        const notifcationMessage = `Notification: A ${
          ccyPair || ccy || ''
        } trade over ${formatNumber(notional)} was executed`
        return symphony
          .sendMessage(request.originalMessage.stream.streamId, standardMessage(updateMessage))
          .pipe(
            concatMap(() =>
              latestTrades$.pipe(
                filter(trade => {
                  if (notional > trade.Notional) {
                    return false
                  }

                  if (ccyPair) {
                    return trade.CurrencyPair === ccyPair
                  }

                  if (ccy) {
                    return trade.CurrencyPair.substr(0, 3) === ccy
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