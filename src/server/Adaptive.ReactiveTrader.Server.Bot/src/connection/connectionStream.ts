import { Observable } from 'rxjs'
import { AutobahnConnection } from './AutoBahnConnection'
import AutobahnSessionProxy from './AutobahnSessionProxy'
import './AutoBahnTypeExtensions'
import { ConnectionType } from './connectionType'
import { DisconnectionReason } from './DisconnectionReason'
const LOG_NAME = 'Service Broker: '
import logger from '../logger'
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
    logger.info(`${LOG_NAME} Connecting to autobahn.`)

    let unsubscribed = false

    autobahn.onopen(session => {
      if (!unsubscribed) {
        logger.info(`${LOG_NAME} Connected to autobahn`)
        obs.next({
          type: ConnectionEventType.CONNECTED,
          session,
          url: autobahn.getConnection().transport.info.url,
          transportType: autobahn.getConnection().transport.info.type,
        })
      }
    })

    autobahn.onclose((reason, details, willRetry) => {
      if (!unsubscribed) {
        switch (reason) {
          case DisconnectionReason.Closed:
            logger.info(`${LOG_NAME} Connection ${reason}`, details)
            obs.complete()
            break
          default:
            if (willRetry) {
              logger.warn(`${LOG_NAME} Connection ${reason}`, details)
              obs.next({
                type: ConnectionEventType.DISCONNECTED,
                reason: details.reason || reason,
                details: details.message,
              })
            } else {
              logger.error(`${LOG_NAME} Connection ${reason}`, details)
              obs.error({ reason, details })
            }
            break
        }
      }
    })

    autobahn.open()

    return () => {
      unsubscribed = true
      logger.warn(`${LOG_NAME} Connection Unsubscribed`)

      // NOTE: It seems that once AutoBahn enters its automatic retry-loop, calling close does not stop it. While the service
      //       remains unreachable, it will continue to attempt to connect until the connection has succeeded. Thus, there is
      //       a race condition bug in AutoBahn.
      autobahn.close()
    }
  })
}
