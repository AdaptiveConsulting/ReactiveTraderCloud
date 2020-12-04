export enum ServiceConnectionStatus {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}

export interface ServiceStatus {
  serviceType: string
  connectedInstanceCount: number
  connectionStatus: ServiceConnectionStatus
}

export enum ConnectionStatus {
  connecting = "connecting",
  connected = "connected",
  disconnecting = "disconnecting",
  disconnected = "disconnected",
  sessionExpired = "sessionExpired",
}

export interface ConnectionInfo {
  status: ConnectionStatus
  url: string
}
