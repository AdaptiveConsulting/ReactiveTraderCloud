import { ConnectionType } from 'rt-system'

export enum ConnectionStatus {
  connected = 'connected',
  disconnected = 'disconnected',
  sessionExpired = 'sessionExpired',
  init = ''
}

export interface ConnectionState {
  status: ConnectionStatus
  url: string
  transportType: ConnectionType
}
