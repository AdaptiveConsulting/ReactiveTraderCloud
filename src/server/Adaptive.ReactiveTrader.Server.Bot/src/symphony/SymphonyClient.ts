import { writeFileSync } from 'fs'
import { from, Observable } from 'rxjs'
import { concatMap, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators'
import * as Symphony from 'symphony-api-client-node'
import logger from '../logger';
import { BotConfig, createConfig } from './config';

class SymphonyClient {

    /* 
        Writing the config from env variables.
    
        The symphony client only lets you read config from the file system. This is not good for docker setups where
        we want to pass config in via env variables.
    */

    static writeConfigFiles = (privateKey: string, configuration: ReturnType<typeof createConfig>, path: string) => {
        writeFileSync(`${path}rsa-private-rt-bot.pem`, privateKey)
        writeFileSync(`${path}config.json`, JSON.stringify(configuration))
    }

    static wrapDataFeed = () => new Observable<Symphony.Message[]>(obs => {
        try {
            logger.info('Connecting to Symphony...')
            Symphony.getDatafeedEventsService({
                onMessage:
                    (messages: Symphony.Message[]) => {
                        obs.next(messages)
                    },
            })
        } catch (error) {
            logger.error('connection to symphony failed', error)
            obs.error(error)
        }
    })

    private botConnnection$: Observable<any>

    constructor(private botConfig: BotConfig, private key: string, debug: boolean, private path: string = 'config/') {
        Symphony.setDebugMode(debug)
        logger.info(`Writing config file to ${path}.`)
        SymphonyClient.writeConfigFiles(this.key, createConfig(this.botConfig, path), path)
        logger.info(`Write complete ${path}`)

        this.botConnnection$ = from(Symphony.initBot(`${this.path}/config.json`)).pipe(shareReplay(1))
    }

    dataEvents$() {
        return this.botConnnection$.pipe(
            switchMap(() => SymphonyClient.wrapDataFeed()),
            concatMap<Symphony.Message[], Observable<Symphony.Message>>(event => from(event)))
    }

    sendMessage(streamId: string, message: string) {
        logger.info('Sending message to symphony:', streamId)
        return this.botConnnection$.pipe(
            mergeMap(() => from(Symphony.sendMessage(streamId, message, null, Symphony.MESSAGEML_FORMAT))),
            take(1))
    }
}

export default SymphonyClient