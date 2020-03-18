import { config } from 'dotenv'
import { WsConnectionProxy, connectionStream$, logger, ServiceStub } from 'shared'
import uuid from 'uuid/v1'
import { NlpIntentRequest } from './types'
import { detectIntent } from './dialogFlowClient'
import { DetectIntentResponse } from 'dialogflow'

config()

const host = process.env.BROKER_HOST || 'localhost'
const port = process.env.BROKER_PORT || 15674

const HOST_TYPE = 'nlp'
const hostInstance = `${HOST_TYPE}.${uuid().substring(0, 4)}`
// const HEARTBEAT_INTERVAL_MS = 1000

// const exit$ = new Observable(observer => {
//   process.on('exit', () => {
//     observer.next()
//     observer.complete()
//   })
// })

logger.info(`Starting NLP service for ${host}:${port}`)

const broker = new WsConnectionProxy(host, +port)

function publishStatus(): void {
  const status = {
    Type: 'nlp',
    Load: 1,
    TimeStamp: Date.now(),
    Instance: hostInstance,
  }
  broker.streamEndpoint.publish({ destination: '/exchange/status', body: JSON.stringify(status) })
}

connectionStream$(broker).subscribe(state => {
  console.debug(`Broker connection state: ${state}`)
  publishStatus()
})

logger.info(`Starting heartbeat for ${hostInstance}`)

const stub = new ServiceStub('BHA', broker)

async function handleNlpRequest(request: NlpIntentRequest): Promise<DetectIntentResponse[]> {
  return await detectIntent(request[0].payload)
}

stub.replyToRequestResponseOperation('nlp', 'getNlpIntent', handleNlpRequest)

// connection$
//   .pipe(
//     takeUntil(exit$),
//     switchMap(session => interval(HEARTBEAT_INTERVAL_MS).pipe(mapTo(session))),
//     tap(() => logger.debug('Publish heartbeat')),
//   )
//   .subscribe(session => {
//     const status = {
//       Type: HOST_TYPE,
//       Load: 1,
//       TimeStamp: Date.now(),
//       Instance: hostInstance,
//     }

//     try {
//       session.publish('status', [status])
//     } catch (err) {
//       logger.error('Failed to publish heartbeat', err)
//     }
//   })

// connection$.pipe(takeUntil(exit$)).subscribe(session => {
//   const topic = `${hostInstance}.getNlpIntent`
//   logger.info(`Registering ${topic}`)

//   session.register(topic, async (request: NlpIntentRequest) => {
//     const result = await detectIntent(request[0].payload)
//     logger.info(`Received response: ${JSON.stringify(result)} for ${JSON.stringify(request)}`)

//     return result
//   })
//})
