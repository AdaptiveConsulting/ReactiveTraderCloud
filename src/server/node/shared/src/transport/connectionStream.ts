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
    tap(x => console.debug('', `Received response on topic status: ${x}`)),
    map(x => {
      let type: ConnectionEventType
      console.info(`ConnectionState: ${x}`)
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
