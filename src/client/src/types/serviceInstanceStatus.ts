export interface ServiceInstanceStatus {
  serviceType: string
  serviceId: string
  timestamp: number
  serviceLoad: number
  isConnected: boolean
}
