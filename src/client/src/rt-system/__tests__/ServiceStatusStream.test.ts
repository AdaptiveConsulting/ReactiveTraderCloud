import { serviceStatusStream$, RawServiceStatus, ServiceInstanceCollection, ServiceCollectionMap } from 'rt-system'
import { TestScheduler } from 'rxjs/testing'
import { ServiceInstanceStatus } from '../serviceInstanceStatus'

jest.clearAllMocks()
const testScheduler = () =>
  new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected)
  })

const MockRawServiceStatus = (overrides: Partial<RawServiceStatus>): RawServiceStatus => ({
  Type: 'Analytics',
  Instance: 'b356',
  TimeStamp: 4500,
  Load: 0,
  ...overrides,
})

const MockServiceInstanceStatus = (overrides: Partial<ServiceInstanceStatus>) => ({
  serviceType: 'Analytics',
  serviceId: 'b356',
  timestamp: 4500,
  serviceLoad: 0,
  isConnected: true,
  ...overrides,
})

describe('ServiceStatusStream', () => {
  it('shows which services are currently running and what their loads are', () => {})

  it('should group similar services together in the serviceCollectionMap', () => {
    const scheduler = testScheduler()
    scheduler.run(({ cold, expectObservable }) => {
      const rss1 = MockRawServiceStatus({})
      const rss2 = MockRawServiceStatus({ Instance: 'b789' })
      const rss3 = MockRawServiceStatus({ Type: 'Blotter' })

      const sistats1 = MockServiceInstanceStatus({ isConnected: false, timestamp: NaN, serviceLoad: NaN })
      const sistats2 = MockServiceInstanceStatus({
        serviceId: 'b789',
        isConnected: false,
        timestamp: NaN,
        serviceLoad: NaN,
      })
      const sistats3 = MockServiceInstanceStatus({
        serviceType: 'Blotter',
        isConnected: false,
        timestamp: NaN,
        serviceLoad: NaN,
      })

      const siCollection1 = new ServiceInstanceCollection(sistats1.serviceType)
      siCollection1.update(sistats1)
      siCollection1.update(sistats2)

      const siCollection2 = new ServiceInstanceCollection(sistats3.serviceType)
      siCollection2.update(sistats3)

      const sc = new ServiceCollectionMap()
      sc.add(siCollection1.serviceType, siCollection1)
      sc.add(siCollection2.serviceType, siCollection2)

      const source$ = cold<RawServiceStatus>('-abc-b--', { a: rss1, b: rss2, c: rss3 })
      const serviceStatus$ = serviceStatusStream$(source$, 3)
      expectObservable(serviceStatus$).toBe('-dddd-d-d', { d: sc })
    })
  })

  it('marks a service as disconnected if a update has not been received for 3 secs', () => {
    const scheduler = testScheduler()
    scheduler.run(({ cold, expectObservable }) => {
      const rss = MockRawServiceStatus({})
      const sistatus = MockServiceInstanceStatus({ isConnected: false, timestamp: NaN, serviceLoad: NaN })
      const sicollection = new ServiceInstanceCollection(sistatus.serviceType)
      sicollection.update(sistatus)
      const sc = new ServiceCollectionMap()
      sc.add(sistatus.serviceType, sicollection)

      const source$ = cold<RawServiceStatus>('-a---', { a: rss })
      const serviceStatus$ = serviceStatusStream$(source$, 3)
      expectObservable(serviceStatus$).toBe('-b--b-', { b: sc })
    })
  })

  it('marks a disconnected service as connected after receiving an update', () => {})
})
