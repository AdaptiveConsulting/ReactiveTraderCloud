import { ServiceCollectionMap } from '../ServiceInstanceCollection'
import { ServiceInstanceStatus } from '../serviceInstanceStatus'

const initServiceInstanceStatus: ServiceInstanceStatus = {
  serviceType: 'Analytics',
  serviceId: 'A.256',
  timestamp: 400,
  serviceLoad: 0,
  isConnected: true,
}
const MockServiceInstanceStatus = (overrides: Partial<ServiceInstanceStatus>) => ({
  ...initServiceInstanceStatus,
  ...overrides,
})

const MockServiceCollectionMap = jest.fn<ServiceCollectionMap>((serviceInstance: ServiceInstanceStatus) => {
  ServiceCollectionMap.prototype.getServiceInstanceStatus = jest.fn((type: string, instance: string) => serviceInstance)
  ServiceCollectionMap.prototype.getServiceInstanceWithMinimumLoad = jest.fn((serviceType: string) => serviceInstance)
  const serviceMapCollection = new ServiceCollectionMap()

  return serviceMapCollection
})

export { MockServiceCollectionMap, MockServiceInstanceStatus }
