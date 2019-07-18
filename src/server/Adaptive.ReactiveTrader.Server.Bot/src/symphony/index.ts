import { writeFileSync } from 'fs'
import { from, Observable } from 'rxjs'
import { concatMap, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators'
import * as Symphony from 'symphony-api-client-node'
import logger from '../logger';

interface BotConfig {
    subdomain: string,
    botUsername: string,
    botEmailAddress: string
}

function createConfig(botConfig: BotConfig) {
    return {
        sessionAuthHost: `${botConfig.subdomain}-api.symphony.com`,
        sessionAuthPort: 443,
        keyAuthHost: `${botConfig.subdomain}.symphony.com`,
        keyAuthPort: 443,
        podHost: `${botConfig.subdomain}.symphony.com`,
        podPort: 443,
        agentHost: `${botConfig.subdomain}.symphony.com`,
        agentPort: 443,
        authType: "rsa",
        botCertPath: "",
        botCertName: "",
        botCertPassword: "",
        botPrivateKeyPath: "rsa/",
        botPrivateKeyName: "rsa-private-rt-bot.pem",
        botUsername: botConfig.botUsername,
        botEmailAddress: botConfig.botEmailAddress,
        appCertPath: "",
        appCertName: "",
        appCertPassword: "",
        proxyURL: "",
        proxyUsername: "",
        proxyPassword: "",
        authTokenRefreshPeriod: "30"
    }
}

/* 
    The symphony client only lets you read config from the file system. This is not good for docker setups where
    we want to pass config in via env variables. 
 */
function writeConfigFiles(privateKey: string, configuration: ReturnType<typeof createConfig>, path: string) {
    writeFileSync(`${path}rsa-private-rt-bot.pem`, privateKey)
    writeFileSync(`${path}config.json`, JSON.stringify(configuration))
}


const wrapDataFeed = () => new Observable<SymphonyEvent>(obs => {
    try {
        logger.info('Connecting to Symphony...')
        Symphony.getDatafeedEventsService((event: string, messages: Symphony.Message[]) => {
            messages.forEach((message) => {
                obs.next({ event, messages })
            })
        })
    } catch (error) {
        logger.error('connection to symphony failed', error)
        obs.error(error)
    }
})

class SymphonyCLient {

    private botConnnection$: Observable<any>

    constructor(private botConfig: BotConfig, private key: string, private debug: boolean, private path: string = 'config/') {
        Symphony.setDebugMode(debug)
        logger.info('Writing config files')
        writeConfigFiles(this.key, createConfig(this.botConfig), path)
        this.botConnnection$ = from(Symphony.initBot(`${this.path}/config.json`)).pipe(shareReplay(1))
    }

    dataEvents$() {
        return this.botConnnection$.pipe(
            switchMap(() => wrapDataFeed()),
            concatMap<SymphonyEvent, Observable<Symphony.Message>>(event => from(event.messages)))
    }

    sendMessage(streamId: string, message: string) {
        return this.botConnnection$.pipe(
            mergeMap(() => from(Symphony.sendMessage(streamId, message, null, Symphony.MESSAGEML_FORMAT))),
            take(1))
    }
}

export interface SymphonyEvent {
    event: string;
    messages: Symphony.Message[]
}


export default SymphonyCLient

// const botHearsSomething = (event: string, messages: Symphony.Message[]) => {
//     messages.forEach((message) => {
//         if (latestPrice) {
//             const priceMessage = `Hello ' ${message.user.firstName}
//         The Price is: 
//         Bid: ${latestPrice.bid}/ Ask: ${latestPrice.ask}`
//             Symphony.sendMessage(message.stream.streamId, priceMessage, null, Symphony.MESSAGEML_FORMAT)
//         }
//     })
// }

// Symphony.initBot('test/config.json')
//     .then((symAuth) => {
//         Symphony.getDatafeedEventsService(botHearsSomething)
//     })