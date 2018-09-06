import { Connection } from 'autobahn'
import { AutobahnConnection } from './AutoBahnConnection'
import AutobahnSessionProxy from './AutobahnSessionProxy'

/**
 * AutobahnProxy: makes the autobahn connection api more explicit, aids testing
 */
export default class AutobahnConnectionProxy implements AutobahnConnection {
  public session?: AutobahnSessionProxy
  private readonly connection: Connection
  private onOpen?: (session: AutobahnSessionProxy) => void
  private onClose?: (reason: string, details: { reason: string; message: string }) => void

  constructor(url: string, realm: string, port?: number) {
    const useSecure = location.protocol === 'https:'
    const securePort = 443
    const defaultPort = port ? port : 80

    this.connection = new Connection({
      realm,
      use_es6_promises: true,
      max_retries: -1, // unlimited retries,
      transports: [
        {
          type: 'websocket',
          url: useSecure ? `wss://${url}:${securePort}/ws` : `ws://${url}:${defaultPort}/ws`
        },
        {
          type: 'longpoll',
          url: useSecure ? `https://${url}:${securePort}/lp` : `http://${url}:${defaultPort}/lp`
        }
      ]
    })
  }

  open() {
    this.connection.onopen = session => {
      this.session = new AutobahnSessionProxy(session)
      if (this.onOpen) {
        this.onOpen(this.session!)
      }
    }

    this.connection.onclose = (reason: string, details: { reason: string; message: string }): boolean => {
      if (this.onClose) {
        this.onClose(reason, details)
      }
      return true
    }

    this.connection.open()
    return true
  }

  getConnection() {
    return this.connection
  }

  close() {
    this.connection.close()
  }

  onopen(callback: (session: AutobahnSessionProxy) => void) {
    this.onOpen = callback
  }

  onclose(callback: (reason: string, details: { reason: string; message: string }) => void) {
    this.onClose = callback
  }
}
