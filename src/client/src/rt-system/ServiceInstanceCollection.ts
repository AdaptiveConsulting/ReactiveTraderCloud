import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { ServiceInstanceStatus } from './serviceInstanceStatus'

export class ServiceInstanceCollection {
  private readonly serviceMap: Map<string, ServiceInstanceStatus> = new Map()

  constructor(public readonly serviceType: string) {}

  update(update: ServiceInstanceStatus) {
    this.serviceMap.set(update.serviceId, update)
    return this
  }

  private getServiceInstances() {
    return Array.from(this.serviceMap.values())
  }

  getServiceNumberOfInstances() {
    return this.getServiceInstances().filter(x => x.isConnected).length
  }
}

export interface IServiceStatusCollection {
  getServiceNumberOfInstances: (serviceType: string) => number | undefined
}
export class ServiceCollectionMap implements IServiceStatusCollection {
  private readonly serviceInstanceCollections = new Map<string, ServiceInstanceCollection>()

  add(service: string, serviceInstanceCollection: ServiceInstanceCollection) {
    this.serviceInstanceCollections.set(service, serviceInstanceCollection)
    return this
  }

  getServiceNumberOfInstances(serviceType: string) {
    const x = this.serviceInstanceCollections.get(serviceType)

    if (x) {
      return x.getServiceNumberOfInstances()
    }

    return undefined
  }

  getStatusOfServices(): ServiceConnectionInfo {
    return Array.from(this.serviceInstanceCollections.values()).reduce<ServiceConnectionInfo>(
      (acc, next) => {
        acc[next.serviceType] = {
          serviceType: next.serviceType,
          connectedInstanceCount: next.getServiceNumberOfInstances(),
          connectionStatus: next.getServiceNumberOfInstances()
            ? ServiceConnectionStatus.CONNECTED
            : ServiceConnectionStatus.DISCONNECTED
        }
        return acc
      },
      {}
    )
  }
}

export interface ServiceConnectionInfo {
  [key: string]: ServiceStatus
}
