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

export { MockServiceInstanceStatus }
