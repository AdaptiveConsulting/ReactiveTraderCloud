import { RxStompRPC, RxStomp } from '@stomp/rx-stomp'
import StompConfig from './StompConfig'

/**
 * BrokerProxy: makes the broker connection api more explicit, aids testing
 */
export default class WsConnection {
  public config: StompConfig
  public rpcEndpoint: RxStompRPC
  public streamEndpoint: RxStomp

  constructor(url: string, port?: number) {
    /* eslint-disable-next-line */
    this.config = new StompConfig(url, port)

    this.streamEndpoint = new RxStomp()
    this.streamEndpoint.configure({
      brokerURL: this.config.brokerURL,
      reconnectDelay: this.config.reconnectDelay,
    })
    this.rpcEndpoint = new RxStompRPC(this.streamEndpoint)

    this.streamEndpoint.activate()
  }
}
