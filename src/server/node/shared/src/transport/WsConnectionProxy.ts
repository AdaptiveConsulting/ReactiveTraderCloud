import { WsConnection } from './WsConnection'
import { RxStompRPC, RxStomp } from '@stomp/rx-stomp'
import StompConfig from './StompConfig'

Object.assign(global, { WebSocket: require('ws') })

/**
 * BrokerProxy: makes the broker connection api more explicit, aids testing
 */
export class WsConnectionProxy implements WsConnection {
  public config: StompConfig
  public rpcEndpoint: RxStompRPC
  public streamEndpoint: RxStomp

  private onOpen?: () => void
  private onClose?: () => void

  constructor(url: string, port?: number) {
    /* eslint-disable-next-line */
    this.config = new StompConfig(url, port)

    this.streamEndpoint = new RxStomp()
    this.streamEndpoint.configure({
      brokerURL: this.config.brokerURL,
      reconnectDelay: this.config.reconnectDelay,
      heartbeatIncoming: 1000,
      heartbeatOutgoing: 1000,
    })
    this.rpcEndpoint = new RxStompRPC(this.streamEndpoint)

    this.open()
  }

  open(): boolean {
    this.streamEndpoint.activate()
    if (this.onOpen) {
      this.onOpen()
    }
    return true
  }

  close(): void {
    try {
      if (this.streamEndpoint.connected()) {
        this.streamEndpoint.deactivate()
      }
      if (this.onClose) {
        this.onClose()
      }
    } catch (e) {}
  }

  onopen(callback: () => void): void {
    this.onOpen = callback
  }

  onclose(callback: () => void): void {
    this.onClose = callback
  }
}
