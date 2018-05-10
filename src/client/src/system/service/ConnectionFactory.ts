import { Observable } from 'rxjs'
import { AutobahnSessionProxy } from '.'
import logger from '../logger'
import { AutobahnConnection } from './AutoBahnConnection'

const log = logger.create('ConnectionFactory')

export enum ConnectionEventType {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED'
}

export interface ConnectionOpenEvent {
  type: ConnectionEventType.CONNECTED
  session: AutobahnSessionProxy
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
      obs.next({ type: ConnectionEventType.CONNECTED, session })
    })

    autobahn.onclose((reason, details) => {
      log.error(`Connection lost, reason: [${reason}]`)
      log.error(`Connection lost, details: [${JSON.stringify(details)}]`)

      obs.next({
        type: ConnectionEventType.DISCONNECTED,
        reason,
        details: details.message
      })
    })

    autobahn.open()
  })
}
