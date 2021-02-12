/**
 * WsProxy: makes the broker connection api more explicit, aids testing
 */
export default class StompConfig {
  public brokerURL: string
  public reconnectDelay: number = 500

  constructor(url: string, port?: number) {
    /* eslint-disable-next-line */
    const securePort = 443
    const useSecure = location.protocol === 'https:' || port === securePort
    const defaultPort = port ? port : 80
    this.brokerURL = useSecure ? `wss://${url}:${securePort}/ws` : `ws://${url}:${defaultPort}/ws`
  }
}
