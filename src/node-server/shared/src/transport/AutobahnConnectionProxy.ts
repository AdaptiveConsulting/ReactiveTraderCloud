import { Connection } from 'autobahn'
import { AutobahnConnection } from './AutoBahnConnection'
import AutobahnSessionProxy from './AutobahnSessionProxy'
import { DisconnectionReason } from './DisconnectionReason'

/**
 * AutobahnProxy: makes the autobahn connection api more explicit, aids testing
 */
export class AutobahnConnectionProxy implements AutobahnConnection {
  public session?: AutobahnSessionProxy
  private readonly connection: Connection
  private onOpen?: (session: AutobahnSessionProxy) => void
  private onClose?: (
    reason: DisconnectionReason,
    details: { reason: string; message: string },
    willRetry: boolean,
  ) => void

  constructor(url: string, realm: string, port?: number) {
    const securePort = 443
    const defaultPort = port ? port : 80

    this.connection = new Connection({
      realm,
      use_es6_promises: true,
      max_retries: -1, // unlimited retries,
      transports: [
        {
          type: 'websocket',
          url: `ws://${url}:${defaultPort}/ws`,
        },
      ],
    })
  }

  open() {
    this.connection.onopen = session => {
      this.session = new AutobahnSessionProxy(session)
      if (this.onOpen) {
        this.onOpen(this.session!)
      }
    }

    this.connection.onclose = (
      reason: string,
      details: { reason: string; message: string; will_retry?: boolean },
    ): boolean => {
      if (this.onClose) {
        this.onClose(reason as DisconnectionReason, details, details.will_retry === true)
      }

      // https://weareadaptive.atlassian.net/browse/ARTP-425
      //
      // Counterintuitvely, returning 'false' here instructs AutoBahn to automatically reconnect after disconnections due to
      // network / service interruptions. Returning any "truthy" value that evaluates to 'true' actually prevents AutoBahn from
      // automatically reconnecting.
      //
      // The docs are unclear on whether "truthy" expects 'true' or 'false':
      //    https://github.com/crossbario/autobahn-js/blob/master/doc/reference.md
      //
      // The source code clearly expects 'false' or 'undefined' to permit auto-reconnection; a return value of 'true' would disable auto-reconnection:
      //    https://github.com/crossbario/autobahn-js/blob/761446b1c92f8423545d38def4fdcc4d95738bd7/lib/connection.js#L382
      return false
    }

    this.connection.open()
    return true
  }

  getConnection() {
    return this.connection
  }

  close() {
    try {
      if (this.connection.isOpen) {
        this.connection.close()
      }
    } catch (e) {
      // Testing has shown that autobahn's close() function may throw an exception (which it logs).
      // We must catch it so that our caller can continue successfully; e.g., the unsubscription
      // function of an observable, which would allow downstream operators such as retryWhen to
      // continue functioning properly.
    }
  }

  onopen(callback: (session: AutobahnSessionProxy) => void) {
    this.onOpen = callback
  }

  onclose(
    callback: (reason: DisconnectionReason, details: { reason: string; message: string }, willRetry: boolean) => void,
  ) {
    this.onClose = callback
  }
}
