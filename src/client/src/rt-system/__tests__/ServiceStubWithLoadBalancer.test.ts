import ServiceStubWithLoadBalancer from '../ServiceStubWithLoadBalancer'
import { MockScheduler } from 'rt-testing'
import { MockServiceStub, MockServiceInstanceStatus, MockServiceCollectionMap } from '../__mocks__'
import { Observable, of } from 'rxjs'
import { ServiceCollectionMap } from 'rt-system'

describe('ServiceStubWithLoadBalancer', () => {
  describe('createRequestResponseOperation', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
    it('should call requestResponse with remoteProcedure and request', () => {
      const testScheduler = new MockScheduler()
      const serviceInstance = MockServiceInstanceStatus({ serviceType: 'Analytics', serviceId: 'A.1', serviceLoad: 0 })
      const serviceCollection = new MockServiceCollectionMap(serviceInstance)

      const cb = jest.fn<Observable<string>>((r: string, p: any, resp: string) => of('result'))

      testScheduler.run(({ cold, expectObservable, flush }) => {
        const serviceInstanceDictionary$ = cold<ServiceCollectionMap>('-s-', { s: serviceCollection })
        const serviceStub = new MockServiceStub(null, cb)
        const serviceStubWithLoadBalancer = new ServiceStubWithLoadBalancer(serviceStub, serviceInstanceDictionary$)
        const req$ = serviceStubWithLoadBalancer.createRequestResponseOperation('Analytics', 'getAnalytics', 'request')
        expectObservable(req$).toBe('-(s|)', { s: 'result' })
        flush()
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith('A.1.getAnalytics', 'request', '')
      })
    })
  })

  describe('createStreamOperation', () => {
    beforeEach(() => {
      const mockMath = Object.create(global.Math)
      mockMath.random = () => 0.5
      global.Math = mockMath
    })

    afterEach(() => {
      jest.clearAllMocks()
    })
    it('should call serviceStub subscribeToTopic', () => {
      const testScheduler = new MockScheduler()
      const serviceInstance = MockServiceInstanceStatus({ serviceType: 'Blotter', serviceId: 'B.547', serviceLoad: 0 })

      const serviceCollection = new MockServiceCollectionMap(serviceInstance)
      const cb1 = jest.fn<Observable<any>>((r: string, p: any, resp: any) => of('result'))
      const cb2 = jest.fn<Observable<any>>((r: string, p: any, resp: any) => of('mal'))

      testScheduler.run(({ cold, expectObservable, flush }) => {
        const serviceInstanceDictionary$ = cold<ServiceCollectionMap>('-s-', { s: serviceCollection })
        const serviceStub = new MockServiceStub(cb1, cb2)
        const serviceStubWithLoadBalancer = new ServiceStubWithLoadBalancer(serviceStub, serviceInstanceDictionary$)

        const response$ = serviceStubWithLoadBalancer.createStreamOperation('Blotter', 'getBlotter', { symbol: 'AAPL' })
        expectObservable(response$).toBe('-(s|)', { s: 'result' })
        flush()
        expect(cb1).toHaveBeenCalledTimes(1)
      })
    })

    it('should call requestResponse with remote when a service subscribed to topics', () => {
      const testScheduler = new MockScheduler()
      const serviceInstance = MockServiceInstanceStatus({ serviceType: 'Blotter', serviceId: 'B.547', serviceLoad: 0 })

      const serviceCollection = new MockServiceCollectionMap(serviceInstance)

      //Attempts to mimick the minal requirements as possible for ServiceStub subscribeTopics method
      const subscribeTopics = jest.fn<Observable<any>>((r: string, p: any, resp: any) => {
        p.next(r)
        return of('result')
      })
      const requestResponse = jest.fn<Observable<any>>((r: string, p: any, resp: any) => of('response'))

      testScheduler.run(({ cold, expectObservable, flush }) => {
        const serviceInstanceDictionary$ = cold<ServiceCollectionMap>('-s-', { s: serviceCollection })
        const serviceStub = new MockServiceStub(subscribeTopics, requestResponse)
        const serviceStubWithLoadBalancer = new ServiceStubWithLoadBalancer(serviceStub, serviceInstanceDictionary$)

        const response$ = serviceStubWithLoadBalancer.createStreamOperation('Blotter', 'getBlotter', { symbol: 'AAPL' })
        expectObservable(response$).toBe('-(s|)', { s: 'result' })
        flush()
        expect(subscribeTopics).toHaveBeenCalledTimes(1)
        expect(requestResponse).toHaveBeenCalledTimes(1)
        expect(requestResponse).toHaveBeenCalledWith('B.547.getBlotter', { symbol: 'AAPL' }, 'topic_Blotter_tv203k')
      })
    })
  })
})
