import { Observable } from 'rxjs/index'
import { map, publishBehavior, refCount } from 'rxjs/operators'
import { Connection } from '../system'
import { ConnectionEventType } from '../system/service/ConnectionFactory'
import { ConnectionStatus } from '../system/service/connectionStatus'
import { ConnectionType } from './../system/service/connectionType'

export interface ConnectionInfo {
  status: ConnectionStatus
  url: string
  transportType: ConnectionType
}

export class ConnectionStatusService {
  private readonly connectionStatusStream$: Observable<ConnectionInfo>

  constructor(connection: Connection) {
    this.connectionStatusStream$ = connection.connectionStream.pipe(
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
