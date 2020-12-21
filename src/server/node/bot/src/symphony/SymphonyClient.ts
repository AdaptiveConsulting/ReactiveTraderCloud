import { writeFileSync } from 'fs'
import { from, Observable } from 'rxjs'
import { concatMap, mergeMap, share, shareReplay, switchMap, take } from 'rxjs/operators'
import * as Symphony from 'symphony-api-client-node'
import logger from '../logger'
import { BotConfig, createConfig } from './config'

class SymphonyClient {
  /* 
        Writing the config from env variables.
   
        The symphony client only lets you read config from the file system. This is not good for docker setups where
        we want to pass config in via env variables.
    */

  static writeConfigFiles = (configuration: ReturnType<typeof createConfig>) => {
    logger.info(`Writing config file to /config/config.json.`)
    writeFileSync(`config/config.json`, JSON.stringify(configuration))
    logger.info(`Write complete`)
  }

  static wrapDataFeed = () =>
    new Observable<Symphony.Message[]>(obs => {
      try {
        logger.info('Connecting to Symphony...')
        Symphony.getDatafeedEventsService({
          onMessage: (messages: Symphony.Message[]) => {
            obs.next(messages)
          },
          onError: (e) => {
            logger.error('Symphony getDatafeedEventsService onError', e)
            obs.error(e)
          }
        })
      } catch (error) {
        logger.error('connection to symphony failed', error)
        obs.error(error)
      }
    })

  private botConnnection$: Observable<any>

  constructor(private botConfig: BotConfig, debug: boolean, keyPath: string, keyName: string) {
    Symphony.setDebugMode(debug)
    SymphonyClient.writeConfigFiles(createConfig(this.botConfig, keyPath, keyName))

    this.botConnnection$ = from(Symphony.initBot(`config/config.json`)).pipe(shareReplay(1))
  }

  dataEvents$() {
    return this.botConnnection$.pipe(
      switchMap(() => SymphonyClient.wrapDataFeed()),
      concatMap<Symphony.Message[], Observable<Symphony.Message>>(event => from(event)),
      share()
    )
  }

  sendMessage(
    streamId: string,
    message: string,
    data: string | null = null,
    format: Symphony.MessageFormat = Symphony.MESSAGEML_FORMAT
  ) {
    logger.info('Sending message to symphony:', streamId)
    return this.botConnnection$.pipe(
      mergeMap(() => from(Symphony.sendMessage(streamId, message, data, format))),
      take(1)
    )
  }
}

export default SymphonyClient
