import { ServiceInstanceStatus } from './serviceInstanceStatus'
import { ServiceConnectionStatus, ServiceStatus } from './serviceStatus'

export class ServiceInstanceCollection {
  private readonly serviceMap: Map<string, ServiceInstanceStatus> = new Map()

  constructor(public readonly serviceType: string) {}

  update(update: ServiceInstanceStatus) {
    this.serviceMap.set(update.serviceId, update)
    return this
  }

  getServiceInstances() {
    return Array.from(this.serviceMap.values())
  }

  get(serviceInstance: string) {
    return this.serviceMap.get(serviceInstance)
  }
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IServiceStatusCollection {
  getServiceInstanceStatus: (type: string, instance: string) => ServiceInstanceStatus | undefined
}
export class ServiceCollectionMap implements IServiceStatusCollection {
  private readonly serviceInstanceCollections = new Map<string, ServiceInstanceCollection>()

  add(service: string, serviceInstanceCollection: ServiceInstanceCollection) {
    this.serviceInstanceCollections.set(service, serviceInstanceCollection)
    return this
  }

  has(service: string) {
    return this.serviceInstanceCollections.has(service)
  }

  get(service: string) {
    return this.serviceInstanceCollections.get(service)
  }

  getServiceInstanceStatus(type: string, instance: string) {
    if (this.serviceInstanceCollections.has(type)) {
      return this.serviceInstanceCollections.get(type)!.get(instance)
    }

    return undefined
  }

  getStatusOfServices(): ServiceConnectionInfo {
    return Array.from(this.serviceInstanceCollections.values()).reduce<ServiceConnectionInfo>((acc, next) => {
      acc[next.serviceType] = {
        serviceType: next.serviceType,
        connectedInstanceCount: next.getServiceInstances().filter(instance => instance.isConnected === true).length,
        connectionStatus: next.getServiceInstances()
          ? ServiceConnectionStatus.CONNECTED
          : ServiceConnectionStatus.DISCONNECTED,
      }
      return acc
    }, {})
  }
}

export interface ServiceConnectionInfo {
  [key: string]: ServiceStatus
}
