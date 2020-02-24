import { filter, mergeMap, withLatestFrom } from 'rxjs/operators'
import logger from '../logger'
import { marketUpdateMessage } from '../messages'
import { Handler } from './handlers'

export const INTENT_MARKET_INFO = 'rt.market.info'

export const marketMessageHandler: Handler = (symphony, { intentsFromDF$ }, { priceSubsription$ }) => {
  const subscription$ = intentsFromDF$
    .pipe(
      filter(({ intentResponse }) => intentResponse.queryResult.intent.displayName === INTENT_MARKET_INFO),
      withLatestFrom(priceSubsription$),
      mergeMap(([request, latestPrices]) => {
        const messageMarkup = marketUpdateMessage(Array.from(latestPrices.values()))
        return symphony.sendMessage(request.originalMessage.stream.streamId, messageMarkup)
      }),
    )
    .subscribe(
      value => {
        logger.info('Market Data sent to Symphony user')
      },
      error => {
        logger.error('Error processing markey data', error)
      },
    )

  return () => {
    subscription$.unsubscribe()
    logger.info('disposed market dtata')
  }
}
