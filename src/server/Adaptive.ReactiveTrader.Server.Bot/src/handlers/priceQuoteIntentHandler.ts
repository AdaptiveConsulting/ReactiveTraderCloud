import { filter, mergeMap, withLatestFrom } from 'rxjs/operators';
import logger from '../logger';
import { createPriceMessage } from '../messages';
import { INTENT_SPOT_QUOTE, IntentStringParameter } from '../nlp-services';
import { Handler } from './handlers';

interface MarketIntentFields {
    CurrencyPairs: IntentStringParameter
}

export const priceQuoteHandler: Handler = (symphony, { intentsFromDF$ }, { priceSubsription$ }) => {

    const subscription$ = intentsFromDF$.pipe(
        filter(x => x.intentResponse.queryResult.intent.displayName === INTENT_SPOT_QUOTE),
        withLatestFrom(priceSubsription$),
        mergeMap(([request, latestPrices]) => {
            const fields: MarketIntentFields = request.intentResponse.queryResult.parameters.fields!;

            const ccyPair = fields.CurrencyPairs.stringValue
            const messageMarkup = createPriceMessage(latestPrices.get(ccyPair)!)
            return symphony.sendMessage(request.originalMessage.stream.streamId, messageMarkup)
        })
    ).subscribe(() => {
        logger.info('Quote sent to Symphony user')
    }, (error) => {
        logger.error('Error processing Quote reply', error)
    })

    return () => {
        subscription$.unsubscribe()
        logger.info('disposed quotes')
    }
}