import { RxStomp, RxStompRPC } from '@stomp/rx-stomp'
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
    this.config = new StompConfig(url, port)

    this.streamEndpoint = this.createStreamEndpoint()
    this.rpcEndpoint = new RxStompRPC(this.streamEndpoint)

    this.streamEndpoint.activate()
  }

  private createStreamEndpoint = () => {
    const stompInstance = new RxStomp()

    stompInstance.configure({ ...this.config })

    stompInstance.webSocketErrors$.subscribe(e => logger.error('WebSocket Error ', e))
    stompInstance.stompErrors$.subscribe(e => logger.error('Stomp Error ', e))

    return stompInstance
  }
}
