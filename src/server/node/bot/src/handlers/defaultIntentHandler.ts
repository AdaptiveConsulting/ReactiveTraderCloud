import { EMPTY } from 'rxjs'
import { catchError, filter, mergeMap } from 'rxjs/operators'
import logger from '../logger'
import { Handler } from './'

const defaultIntentHander: Handler = (symphony, { intentsFromDF$ }) => {
  const subscription$ = intentsFromDF$
    .pipe(
      filter(({ intentResponse }) =>
        ['Default Welcome Intent', 'Default Fallback Intent'].includes(
          intentResponse.queryResult.intent.displayName
        )
      ),
      mergeMap(({ intentResponse, originalMessage }) => {
        return symphony.sendMessage(
          originalMessage.stream.streamId,
          intentResponse.queryResult.fulfillmentText
        )
      }),
      catchError(e => {
        logger.error('Error sending default response', e)
        return EMPTY
      })
    )
    .subscribe(
      value => {
        logger.info('Default message sent to Symphony user')
      },
      error => {
        logger.error('Error sending default response', error)
      }
    )

  return () => {
    subscription$.unsubscribe()
    logger.info('disposed default handler')
  }
}

export default defaultIntentHander
