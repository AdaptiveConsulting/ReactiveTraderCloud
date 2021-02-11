export interface RawServiceStatus {
  Type: string
  Instance: string
  TimeStamp: number
  Load: number
}

export interface ServiceInstanceStatus {
  serviceType: string
  serviceId: string
  timestamp: number
  serviceLoad: number
}
