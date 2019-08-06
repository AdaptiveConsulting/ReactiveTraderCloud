import { filter, map, mergeMap, scan, withLatestFrom } from 'rxjs/operators';
import { Trade } from '../domain';
import logger from '../logger';
import { tradeUpdateMessage } from '../messages';
import { INTENT_TRADES_INFO, IntentNumberParameter, IntentStringParameter } from '../nlp-services';
import { Handler } from './handlers';

interface TradeIntentFields {
    number?: IntentNumberParameter
    CurrencyPairs?: IntentStringParameter
    Currency?: IntentStringParameter
}

export const tradeMessageHandler: Handler = (symphony, { intentsFromDF$ }, { tradeStream$ }) => {

    const latestTrades$ = tradeStream$
        .pipe(
            map(tradeUpdate => tradeUpdate.Trades),

            scan<Trade[], Map<number, Trade>>((acc, trades) => {
                trades.forEach(trade => acc.set(trade.TradeId, trade))
                return acc
            },
                new Map<number, Trade>()),
            map(trades => Array.from(trades.values()))
        )

    const subscription$ = intentsFromDF$.pipe(
        filter(x => x.intentResponse.queryResult.intent.displayName === INTENT_TRADES_INFO),
        withLatestFrom(latestTrades$),
        mergeMap(([request, trades]) => {
            const fields: TradeIntentFields = request.intentResponse.queryResult.parameters.fields;
            const count = fields.number ? fields.number.numberValue : 20
            const ccyPair = fields.CurrencyPairs ? fields.CurrencyPairs.stringValue : ''
            const Currency = fields.Currency ? fields.Currency.stringValue : ''

            let filteredTrades = trades

            if (ccyPair) {
                filteredTrades = filteredTrades.filter(x => x.CurrencyPair === ccyPair)
            }

            if (Currency) {
                filteredTrades = filteredTrades.filter(x => x.CurrencyPair.includes(Currency))
            }

            if(count){
                filteredTrades = filteredTrades.slice(0, count)
            }

            return symphony.sendMessage(request.originalMessage.stream.streamId, tradeUpdateMessage(filteredTrades))
        })
    ).subscribe((value) => {
        logger.info('Trades sent to Symphony user')
    }, (error) => {
        logger.error('Error processing trade reply', error)
    })

    return () => {
        subscription$.unsubscribe()
        logger.info('disposed trades')
    }
}