/**
 * WsProxy: makes the broker connection api more explicit, aids testing
 */
export default class StompConfig {
  public brokerURL: string
  public connectionTimeout = 500
  public reconnectDelay = 500

  constructor(url: string, port?: number) {
    /* eslint-disable-next-line */
    const defaultPort = port ? port : 80
    const useSecure = port === 443
    this.brokerURL = `${useSecure ? 'wss' : 'ws'}://${url}:${defaultPort}/ws`
  }
}
