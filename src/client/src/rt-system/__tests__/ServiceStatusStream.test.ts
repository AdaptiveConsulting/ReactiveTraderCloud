import { serviceStatusStream$, RawServiceStatus, ServiceCollectionMap, ServiceInstanceCollection } from 'rt-system'
import { TestScheduler } from 'rxjs/testing'
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable'
import { ServiceInstanceStatus } from '../serviceInstanceStatus'
import { mapToServiceCollectionMap$, mapToServiceInstanceCollection$ } from '../serviceStatusStream'
// import { of } from 'rxjs';
import { groupBy } from 'rxjs/operators'
// import { HotObservable } from 'rxjs/internal/testing/HotObservable';

jest.clearAllMocks()
const testScheduler = () =>
  new TestScheduler((actual, expected) => {
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
  // it('should return a serviceCollectionMap of disconnected servicestatus instance', () => {
  //   // testScheduler().run(({ cold, expectObservable, flush }) => {
  //   //   const rawServiceDict = {
  //   //     a: MockRawServiceStatus,
  //   //   }
  //   //   const statusUpdates$: ColdObservable<RawServiceStatus> = cold('--a-|', rawServiceDict)
  //   //   const serviceStatus$ = serviceStatusStream$(statusUpdates$, 2)
  //   //   const expectedStream = '--d-(d|)'
  //   //   const collectionMap = MockCollectionMap()
  //   //   expectObservable(serviceStatus$).toBe(expectedStream, { d: collectionMap })
  //   //   flush()
  //   expect(1).toBe(1)
  //   // })
  // })

  describe('mapToServiceInstanceCollection', () => {
    it('should group serviceInstanceStatus according to their serviceId and map to ServiceInstanceCollection', () => {
      testScheduler().run(({ cold, expectObservable }) => {
        const a = MockServiceInstanceStatus
        const b = { ...MockServiceInstanceStatus, serviceId: 'b789', timestamp: 6000, isConnected: true }
        const c = { ...MockServiceInstanceStatus, serviceType: 'blotter', serviceId: '4drf', timestamp: 4000 }
        const source: ColdObservable<ServiceInstanceStatus> = cold('--abc-|', { a, b, c })
        const source$ = source.pipe(groupBy(serviceInstanceStatus => serviceInstanceStatus.serviceType))
        const serviceInstanceCollection$ = mapToServiceInstanceCollection$(source$, 3)
        const expected = '--ffgff(g|)'
        const sv1 = MockNoneConnectedServiceInstance
        const sc2 = new ServiceInstanceCollection('Analytics')
        const sv2 = { ...MockNoneConnectedServiceInstance, serviceId: 'b789' }
        sc2.update(sv1)
        sc2.update(sv2)
        const sc3 = new ServiceInstanceCollection('blotter')
        const sv3 = { ...MockNoneConnectedServiceInstance, serviceType: 'blotter', serviceId: '4drf' }
        sc3.update(sv3)

        expectObservable(serviceInstanceCollection$).toBe(expected, { f: sc2, g: sc3 })
      })
    })
  })

  describe('mapToServiceCollectionMap', () => {
    it('should map serviceInstanceCollection instances to ServiceCollectionMap ', () => {
      testScheduler().run(({ cold, expectObservable }) => {
        const a = MockServiceInstanceStatus
        const b = { ...MockServiceInstanceStatus, serviceId: '3c54' }
        const c = { ...MockServiceInstanceStatus, serviceType: 'blotter', serviceId: '4drf' }
        const collection1 = new ServiceInstanceCollection('Analytics')
        collection1.update(a)
        const collection2 = new ServiceInstanceCollection('Analytics')
        collection2.update(b)
        collection2.update(a)
        const collection3 = new ServiceInstanceCollection('blotter')
        collection3.update(c)
        const source$: ColdObservable<ServiceInstanceCollection> = cold('--a--b-c|', {
          a: collection1,
          b: collection2,
          c: collection3,
        })
        const obs = mapToServiceCollectionMap$(source$)
        const expected = '--d--e-f|'
        const scm = new ServiceCollectionMap()
        scm.add('Analytics', collection1)
        scm.add('Analytics', collection2)
        scm.add('blotter', collection3)
        expectObservable(obs).toBe(expected, { d: scm, e: scm, f: scm })
      })
    })
  })
})

const MockServiceInstanceStatus = {
  serviceType: 'Analytics',
  serviceId: 'b356',
  timestamp: 4500,
  serviceLoad: 0,
  isConnected: true,
}

const MockNoneConnectedServiceInstance = {
  serviceType: 'Analytics',
  serviceId: 'b356',
  timestamp: NaN,
  serviceLoad: NaN,
  isConnected: false,
}
