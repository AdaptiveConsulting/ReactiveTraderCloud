import { ConnectionType } from './connectionType'

/**
 * WsProxy: makes the broker connection api more explicit, aids testing
 */
export default class StompConfig {
  public brokerURL: string
  public reconnectDelay = 500
  public connectionType: ConnectionType = 'ws'

  constructor(url: string, port?: number) {
    /* eslint-disable-next-line */
    const defaultPort = port ? port : 80
    this.brokerURL = `ws://${url}:${defaultPort}/ws`
  }
}
