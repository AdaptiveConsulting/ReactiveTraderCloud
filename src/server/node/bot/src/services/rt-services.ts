import { connectToGateway } from '@adaptive/hydra-platform'
import { noop } from 'rxjs'
import logger from '../logger'

const { Crypto } = require('@peculiar/webcrypto')

// Global packages used by hydra-platform that aren't available in node by default
Object.assign(global, {
  WebSocket: require('ws'),
  crypto: new Crypto()
})

export function initApplicationServices(host: string) {
  connectToGateway({
    url: `https://${host}/ws`,
    interceptor: noop,
    useJson: false,
    autoReconnect: true
  })

  logger.info(`Started bot-service for ${host}`)
}
