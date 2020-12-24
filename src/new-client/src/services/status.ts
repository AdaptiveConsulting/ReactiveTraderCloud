import { watch$ } from "services/client"
import { scan } from "rxjs/operators"

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
  isConnected: boolean
}

const convertFromRawMessage = (
  serviceStatus: RawServiceStatus,
): ServiceInstanceStatus => {
  return {
    serviceType: serviceStatus.Type,
    serviceId: serviceStatus.Instance,
    timestamp: serviceStatus.TimeStamp,
    serviceLoad: serviceStatus.Load,
    isConnected: true,
  }
}

export const status$ = watch$<RawServiceStatus>("status").pipe(
  scan((acc, raw) => {
    const newAcc: Record<string, ServiceInstanceStatus> = acc
    const newStatus = convertFromRawMessage(raw)
    newAcc[newStatus.serviceId] = newStatus
    return newAcc
  }, {} as Record<string, ServiceInstanceStatus>),
)
