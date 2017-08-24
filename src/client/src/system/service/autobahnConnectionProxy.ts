import { Connection, Session } from 'autobahn';
import AutobahnSessionProxy from './autobahnSessionProxy';

/**
 * AutobahnProxy: makes the autobahn connection api more explicit, aids testing
 */
export default class AutobahnConnectionProxy {
  session: AutobahnSessionProxy;
  connection: Connection;
  _onOpen;
  _onClose;

  constructor(url: string, realm: string) {
    const useSecure = location.protocol === 'https:';
    const securePort = 443;
    const defaultPort = 80;
    this.connection = new Connection({
      realm: realm,
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
    });
  }

  open() {
    this.connection.onopen = session => {
      this.session = new AutobahnSessionProxy(session);
      if (this._onOpen) {
        this._onOpen(session);
      }
    };

    this.connection.onclose = (reason: string, details: { reason: string, message: string }): boolean => {
      if (this._onClose) {
        this._onClose(reason, details);
      }
      return true;
    };
    this.connection.open();
    return true;
  }

  close() {
    this.connection.close();
  }

  onopen(callback: (session: Session) => void) {
    this._onOpen = callback;
  }

  onclose(callback: (reason: string, details: { reason: string, message: string }) => void) {
    this._onClose = callback;
  }
}
