import { Observable } from 'rxjs'
import { map, publishBehavior, refCount } from 'rxjs/operators'
import { ConnectionEvent, ConnectionEventType, ConnectionStatus, ConnectionType } from '../../system'

export interface ConnectionInfo {
  status: ConnectionStatus
  url: string
  transportType: ConnectionType
}

export class ConnectionStatusService {
  private readonly connectionStatusStream$: Observable<ConnectionInfo>

  constructor(connection: Observable<ConnectionEvent>) {
    this.connectionStatusStream$ = connection.pipe(
      map(connectionUpdate => {
        if (connectionUpdate.type === ConnectionEventType.CONNECTED) {
          return {
            status: ConnectionStatus.connected,
            url: connectionUpdate.url,
            transportType: connectionUpdate.transportType
          }
        } else {
          return {
            status: ConnectionStatus.disconnected,
            url: 'Disconnected',
            transportType: ConnectionType.Unknown
          }
        }
      }),
      publishBehavior({
        status: ConnectionStatus.init,
        url: 'Starting',
        transportType: ConnectionType.Unknown
      }),

      refCount()
    )
  }

  get connectionStatus$() {
    return this.connectionStatusStream$
  }
}
