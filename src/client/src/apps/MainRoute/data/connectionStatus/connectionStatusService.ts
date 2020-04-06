import {
  ConnectionEvent,
  ConnectionEventType,
  ConnectionStatusType,
  ConnectionStatus,
} from 'rt-system'
import { Observable } from 'rxjs'
import { map, publishBehavior, refCount } from 'rxjs/operators'

export interface ConnectionInfo {
  status: ConnectionStatusType
  url: string
}

export class ConnectionStatusService {
  private readonly connectionStatusStream$: Observable<ConnectionInfo>

  constructor(connection: Observable<ConnectionEvent>) {
    this.connectionStatusStream$ = connection.pipe(
      map<ConnectionEvent, ConnectionInfo>(connectionUpdate => {
        if (connectionUpdate.type === ConnectionEventType.CONNECTED) {
          return {
            status: ConnectionStatus.connected,
            url: connectionUpdate.url,
          }
        } else {
          return {
            status: ConnectionStatus.disconnected,
            url: 'Disconnected',
          }
        }
      }),
      publishBehavior({
        status: ConnectionStatus.init,
        url: 'Starting',
      } as ConnectionInfo),

      refCount(),
    )
  }

  get connectionStatus$() {
    return this.connectionStatusStream$
  }
}
