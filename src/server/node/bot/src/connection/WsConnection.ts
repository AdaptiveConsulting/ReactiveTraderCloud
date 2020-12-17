import { RxStompRPC, RxStomp } from '@stomp/rx-stomp'
import logger from '../logger'
import StompConfig from './StompConfig'

Object.assign(global, { WebSocket: require('ws') })

/**
 * BrokerProxy: makes the broker connection api more explicit, aids testing
 */
export class WsConnection {
  public config: StompConfig
  public rpcEndpoint: RxStompRPC
  public streamEndpoint: RxStomp

  constructor(url: string, port?: number) {
    /* eslint-disable-next-line */
    this.config = new StompConfig(url, port)

    this.streamEndpoint = this.createStreamEndpoint()
    this.rpcEndpoint = new RxStompRPC(this.streamEndpoint)

    this.streamEndpoint.activate()
  }

  private createStreamEndpoint = () => {
    const stompInstance = new RxStomp()

    logger.info(`Broker URL: ${this.config.brokerURL}`)
    logger.info(`Reconnect Delay: ${this.config.reconnectDelay}`)

    stompInstance.configure({
      brokerURL: this.config.brokerURL,
      reconnectDelay: this.config.reconnectDelay
    })

    stompInstance.webSocketErrors$.subscribe(e => logger.error('WebSocket Error ', e))
    stompInstance.stompErrors$.subscribe(e => logger.error('Stomp Error ', e))

    return stompInstance
  }
}
