import { ServiceInstanceStatus } from '../types/index'

export class ServiceInstanceCollection {
  private readonly serviceMap: Map<string, ServiceInstanceStatus> = new Map()

  constructor(public readonly serviceType: string) {}

  update(update: ServiceInstanceStatus) {
    this.serviceMap.set(update.serviceType, update)
    return this
  }

  getServiceInstances() {
    return Array.from(this.serviceMap.values())
  }

  getServiceWithMinLoad() {
    return this.getServiceInstances()
      .filter(x => x.isConnected)
      .sort((x, y) => x.serviceLoad - y.serviceLoad)[0]
  }
}

export class ServiceCollectionMap {
  private readonly serviceInstanceCollections = new Map<
    string,
    ServiceInstanceCollection
  >()

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

  getServiceInstanceWithMinimumLoad(serviceType: string) {
    const x = this.serviceInstanceCollections.get(serviceType)

    if (x) {
      return x.getServiceWithMinLoad()
    }

    return undefined
  }

  getStatusOfServices(): ServiceConnectionInfo {
    return Array.from(this.serviceInstanceCollections.values()).reduce<
      ServiceConnectionInfo
    >((acc, next) => {
      acc[next.serviceType] = {
        serviceType: next.serviceType,
        connectedInstanceCount: next.getServiceInstances().length,
        isConnected: !!next.getServiceWithMinLoad()
      }
      return acc
    }, {})
  }
}

export interface ServiceConnectionInfo {
  [key: string]: {
    serviceType: string
    connectedInstanceCount: number
    isConnected: boolean
  }
}
