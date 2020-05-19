import { Observable } from 'rxjs'
import WsConnection from './WsConnection'
import { RxStompState } from '@stomp/rx-stomp'
import { map, tap } from 'rxjs/operators'

export enum ConnectionStatus {
  connecting = 'connecting',
  connected = 'connected',
  disconnecting = 'disconnecting',
  disconnected = 'disconnected',
  sessionExpired = 'sessionExpired'
}

export interface ConnectionInfo {
  status: ConnectionStatus
  url: string
}

export function connectionStream$(broker: WsConnection): Observable<ConnectionInfo> {
  return broker.streamEndpoint.connectionState$.pipe(
    tap(state => console.debug('', `Received response on topic status: ${state}`)),
    map(state => {
      let status: ConnectionStatus
      let url: string = broker.config.brokerURL

      switch (state) {
        case RxStompState.CONNECTING:
          status = ConnectionStatus.connecting
          url = 'Starting'
          break
        case RxStompState.OPEN:
          status = ConnectionStatus.connected
          break
        case RxStompState.CLOSING:
          status = ConnectionStatus.disconnecting
          break
        case RxStompState.CLOSED:
          status = ConnectionStatus.disconnected
          url = 'Disconnected'
          break
      }

      return {
        status: status,
        url: url
      }
    })
  )
}
