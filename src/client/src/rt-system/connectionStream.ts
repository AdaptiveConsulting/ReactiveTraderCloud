import logdown from 'logdown'
import { Observable } from 'rxjs'
import { AutobahnSessionProxy } from '.'
import { AutobahnConnection } from './AutoBahnConnection'
import { ConnectionType } from './connectionType'

const LOG_NAME = 'ConnectionFactory: '
const logger = logdown(`app:${LOG_NAME}`, { prefixColor: 'Teal' })
const warnLogger = logdown(`app:${LOG_NAME} Warning `, { prefixColor: 'Tomato' })
const errorLogger = logdown(`app:${LOG_NAME} Error `, { prefixColor: 'DarkRed' })

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
      logger.info('*Connected*')
      obs.next({
        type: ConnectionEventType.CONNECTED,
        session,
        url: autobahn.getConnection().transport.info.url,
        transportType: autobahn.getConnection().transport.info.type,
      })
    })

    autobahn.onclose((reason, details) => {
      if (reason === 'closed') {
        warnLogger.warn('*Connection closed*')
        obs.complete()
      } else {
        errorLogger.error(`*Connection lost*, details: [${JSON.stringify(details)}]`)
        obs.error({
          type: ConnectionEventType.DISCONNECTED,
          reason,
          details: details.message,
        })
      }
    })

    autobahn.open()

    return () => {
      logger.log('*Disconnected*')
      obs.complete()
      autobahn.close()
    }
  })
}
