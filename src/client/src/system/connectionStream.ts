import { Observable } from 'rxjs'
import { AutobahnConnection } from './AutoBahnConnection'
import { ConnectionType } from './connectionType'
import { AutobahnSessionProxy } from './index'
import logger from './logger'

const log = logger.create('ConnectionFactory')

export enum ConnectionEventType {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED'
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

export function createConnection$(
  autobahn: AutobahnConnection
): Observable<ConnectionEvent> {
  return new Observable(obs => {
    autobahn.onopen(session => {
      log.info('Connected')
      obs.next({
        type: ConnectionEventType.CONNECTED,
        session,
        url: autobahn.getConnection().transport.info.url,
        transportType: autobahn.getConnection().transport.info.type
      })
    })

    autobahn.onclose((reason, details) => {
      if (reason === 'closed') {
        log.warn('Connection closed')
        obs.complete()
      } else {
        log.error(`Connection lost, details: [${JSON.stringify(details)}]`)
        obs.error({
          type: ConnectionEventType.DISCONNECTED,
          reason,
          details: details.message
        })
      }
    })

    autobahn.open()

    return () => {
      console.log('Disconnected')
      obs.complete()
      autobahn.close()
    }
  })
}
