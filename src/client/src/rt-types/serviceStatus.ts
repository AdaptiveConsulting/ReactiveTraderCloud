/**
 * Provides a status of the instances for a given service type
 */

export interface ServiceStatus {
  serviceType: string
  connectedInstanceCount: number
  connectionStatus: ServiceConnectionStatus
}

export enum ServiceConnectionStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED'
}
