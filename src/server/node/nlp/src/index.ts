import { config } from 'dotenv'
import { WsConnection, Heartbeat, logger, ServiceStub } from 'shared'
import uuid from 'uuid/v1'
import { NlpIntentRequest } from './types'
import { detectIntent } from './dialogFlowClient'
import { DetectIntentResponse } from 'dialogflow'

config()

const host = process.env.BROKER_HOST || 'localhost'
const port = process.env.BROKER_PORT || 15674

const HOST_TYPE = 'nlp'
const hostInstance = `${HOST_TYPE}.${uuid().substring(0, 4)}`

logger.info(`Starting NLP service for ${host}:${port}`)

const broker = new WsConnection(host, +port)
const heartbeat = new Heartbeat(broker, HOST_TYPE, hostInstance)
heartbeat.StartHeartbeat()

logger.info(`Starting heartbeat for ${hostInstance}`)

const stub = new ServiceStub('BHA', broker)

async function handleNlpRequest(request: NlpIntentRequest): Promise<DetectIntentResponse[]> {
  return await detectIntent(request.payload)
}

stub.replyToRequestResponse('nlp.getNlpIntent', handleNlpRequest)
