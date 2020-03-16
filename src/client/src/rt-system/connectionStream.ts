import { Observable } from 'rxjs'
import { WsConnection } from './WsConnection'
import { ConnectionType } from './connectionType'
import { RxStompState } from '@stomp/rx-stomp'
import { map } from 'rxjs/operators'

export enum ConnectionEventType {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  CLOSING = 'CLOSING',
  DISCONNECTED = 'DISCONNECTED',
}

export interface ConnectionEvent {
  type: ConnectionEventType
  url: string
  transportType: ConnectionType
}

export function createConnection$(broker: WsConnection): Observable<ConnectionEvent> {
  return broker.streamEndpoint.connectionState$.pipe(
    map(x => {
      let type: ConnectionEventType
      switch (x) {
        case RxStompState.CONNECTING:
          type = ConnectionEventType.CONNECTING
          break
        case RxStompState.OPEN:
          type = ConnectionEventType.CONNECTED
          break
        case RxStompState.CLOSING:
          type = ConnectionEventType.CLOSING
          break
        case RxStompState.CLOSED:
          type = ConnectionEventType.DISCONNECTED
          break
      }

      return {
        type: type,
        url: broker.config.brokerURL,
        transportType: broker.config.connectionType,
      } as ConnectionEvent
    }),
  )
}
