/**
 * Provides a status of the instances for a given service type
 */

export interface ServiceStatus {
  serviceType: string
  connectedInstanceCount: number
  isConnected: boolean
}
