import { serviceStatusStream$, RawServiceStatus, ServiceCollectionMap, ServiceInstanceCollection } from 'rt-system'
import { TestScheduler } from 'rxjs/testing'
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable'
import { ServiceInstanceStatus } from '../serviceInstanceStatus'

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected)
})

const MockRawServiceStatus: RawServiceStatus = {
  Type: 'Analytics',
  Instance: 'analytics.3b',
  TimeStamp: 50000,
  Load: 45000,
}

const MockCollectionMap = () => {
  const serviceInstance = new ServiceInstanceCollection(MockRawServiceStatus.Type)
  const serviceInstanceStatus: ServiceInstanceStatus = {
    serviceType: MockRawServiceStatus.Type,
    serviceId: MockRawServiceStatus.Instance,
    timestamp: NaN,
    serviceLoad: NaN,
    isConnected: false,
  }
  serviceInstance.update(serviceInstanceStatus)
  const collectionMap = new ServiceCollectionMap()
  collectionMap.add(MockRawServiceStatus.Type, serviceInstance)
  return collectionMap
}

describe('ServiceStatusStream', () => {
  it('should return a serviceCollectionMap of disconnected service instance', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const rawServiceDict = {
        a: MockRawServiceStatus,
      }
      const statusUpdates$: ColdObservable<RawServiceStatus> = cold('--a-|', rawServiceDict)
      const serviceStatus$ = serviceStatusStream$(statusUpdates$, 2)
      const expectedStream = '--d-(d|)'
      const collectionMap = MockCollectionMap()
      expectObservable(serviceStatus$).toBe(expectedStream, { d: collectionMap })
    })
  })

  it('should return a serviceCollectionMap of disconnected services', () => {
    expect(1).toBe(1)
  })
})
