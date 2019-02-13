import { ServiceInstanceCollection, ServiceCollectionMap } from '../ServiceInstanceCollection'
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

const MockServiceInstanceCollection = jest.fn<ServiceInstanceCollection>((...args: ServiceInstanceStatus[]) => {
  const servinceInstanceCollection = new ServiceInstanceCollection(args[0].serviceType)
  for (const e of args) {
    servinceInstanceCollection.update(e)
  }
  return servinceInstanceCollection
})

const MockServiceCollectionMap = jest.fn<ServiceCollectionMap>((...args: ServiceInstanceCollection[]) => {
  const serviceMapCollection = new ServiceCollectionMap()
  for (const e of args) {
    serviceMapCollection.add(e.serviceType, e)
  }
  return serviceMapCollection
})

export { MockServiceCollectionMap, MockServiceInstanceCollection, MockServiceInstanceStatus }
