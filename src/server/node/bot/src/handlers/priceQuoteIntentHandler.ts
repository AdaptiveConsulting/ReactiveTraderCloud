import { filter, mergeMap, withLatestFrom } from 'rxjs/operators'
import logger from '../logger'
import { createPriceMessage } from '../messages'
import { IntentStringParameter } from '../nlp-services'
import { Handler } from './'

interface MarketIntentFields {
  CurrencyPairs: IntentStringParameter
}

const ENTITY_TYPE = 'com.adaptive.fx'
export const INTENT_SPOT_QUOTE = 'rt.spot.quote'

const createDataPayload = (symbol: string) =>
  JSON.stringify({
    entityIdentifier: {
      type: ENTITY_TYPE,
      version: 0.2,
      symbol,
    },
  })

const priceQuoteIntentHandler: Handler = (symphony, { intentsFromDF$ }, { priceSubsription$ }) => {
  const subscription$ = intentsFromDF$
    .pipe(
      filter(x => x.intentResponse.queryResult.intent.displayName === INTENT_SPOT_QUOTE),
      withLatestFrom(priceSubsription$),
      mergeMap(([request, latestPrices]) => {
        const fields: MarketIntentFields = request.intentResponse.queryResult.parameters.fields!

        const ccyPair = fields.CurrencyPairs.stringValue

        const messageMarkup = createPriceMessage(latestPrices.get(ccyPair)!)
        return symphony.sendMessage(
          request.originalMessage.stream.streamId,
          messageMarkup,
          createDataPayload(ccyPair)
        )
      })
    )
    .subscribe(
      () => {
        logger.info('Quote sent to Symphony user')
      },
      error => {
        logger.error('Error processing Quote reply', error)
      }
    )

  return () => {
    subscription$.unsubscribe()
    logger.info('disposed quotes')
  }
}

export default priceQuoteIntentHandler