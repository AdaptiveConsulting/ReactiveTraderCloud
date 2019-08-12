import { filter, mergeMap } from 'rxjs/operators'
import logger from '../logger'
import { Handler } from './handlers'

const message = `<div class="entity" data-entity-id="entityIdentifier">An object</div>`

const json = {
  entityIdentifier: {
    type: 'com.adaptive.fx',
    version: '0.1',
    id: [
      {
        type: 'org.symphonyoss.fin.security.id.isin',
        value: 'US0378',
      },
      {
        type: 'org.symphonyoss.fin.security.id.cusip',
        value: '037',
      },
      {
        type: 'org.symphonyoss.fin.security.id.openfigi',
        value: 'BBG000',
      },
    ],
  },
}

export const defaultIntentHander: Handler = (symphony, { intentsFromDF$ }) => {
  const subscription$ = intentsFromDF$
    .pipe(
      filter(({ intentResponse }) =>
        ['Default Welcome Intent', 'Default Fallback Intent'].includes(intentResponse.queryResult.intent.displayName),
      ),
      mergeMap(({ intentResponse, originalMessage }) => {
        return symphony.sendMessage(originalMessage.stream.streamId, message, JSON.stringify(json))
      }),
    )
    .subscribe(
      value => {
        logger.info('Default message sent to Symphony user')
      },
      error => {
        logger.error('Error processing market data', error)
      },
    )

  return () => {
    subscription$.unsubscribe()
    logger.info('disposed default handler')
  }
}
