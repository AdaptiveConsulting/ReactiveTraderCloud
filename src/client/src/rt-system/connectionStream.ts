import logger, { DebugType } from 'logger'
import { Observable } from 'rxjs'
import { AutobahnSessionProxy } from '.'
import { AutobahnConnection } from './AutoBahnConnection'
import { ConnectionType } from './connectionType'

const LOG_NAME = 'ConnectionFactory:'
const infoLogger = logger.info(LOG_NAME)
const warnLogger = logger.warn(LOG_NAME, DebugType.Warning)
const errorLogger = logger.error(LOG_NAME, DebugType.Error)

export enum ConnectionEventType {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export interface ConnectionOpenEvent {
  type: ConnectionEventType.CONNECTED
  session: AutobahnSessionProxy
  url: string
  transportType: ConnectionType
}

export interface ConnectionClosedEvent {
  type: ConnectionEventType.DISCONNECTED
  reason: string
  details?: string
}

export type ConnectionEvent = ConnectionOpenEvent | ConnectionClosedEvent

export function createConnection$(autobahn: AutobahnConnection): Observable<ConnectionEvent> {
  return new Observable(obs => {
    autobahn.onopen(session => {
      infoLogger('*Connected*')
      obs.next({
        type: ConnectionEventType.CONNECTED,
        session,
        url: autobahn.getConnection().transport.info.url,
        transportType: autobahn.getConnection().transport.info.type,
      })
    })

    autobahn.onclose((reason, details) => {
      if (reason === 'closed') {
        warnLogger('*Connection closed*')
        obs.complete()
      } else {
        errorLogger(`*Connection lost*, details: [${JSON.stringify(details)}]`)
        obs.error({
          type: ConnectionEventType.DISCONNECTED,
          reason,
          details: details.message,
        })
      }
    })

    autobahn.open()

    return () => {
      infoLogger('*Disconnected*')
      obs.complete()
      autobahn.close()
    }
  })
}
