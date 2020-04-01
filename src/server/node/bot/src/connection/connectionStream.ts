import { Observable } from 'rxjs'
import { WsConnection } from './WsConnection'
import { ConnectionType } from './connectionType'
import { RxStompState } from '@stomp/rx-stomp'
import { map, tap } from 'rxjs/operators'

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

export function connectionStream$(broker: WsConnection): Observable<ConnectionEvent> {
  return broker.streamEndpoint.connectionState$.pipe(
    tap(status => console.debug('', `Received response on topic status: ${status}`)),
    map(status => {
      let type: ConnectionEventType = ConnectionEventType.DISCONNECTED
      switch (status) {
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
