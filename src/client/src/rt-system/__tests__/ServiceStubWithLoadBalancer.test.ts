import ServiceStubWithLoadBalancer from '../ServiceStubWithLoadBalancer'
import { MockScheduler } from 'rt-testing'
import { Observable, of } from 'rxjs'
import { ServiceInstanceStatus } from '../serviceInstanceStatus'
import { IServiceStatusCollection, ServiceStub } from 'rt-system'

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

describe('ServiceStubWithLoadBalancer', () => {
  type CallBack = (r: string, p: any, resp: string) => Observable<any>

  const MockServiceStub = jest.fn((c1?: CallBack, c2?: CallBack) => ({
    subscribeToTopic: (r: string, p: any, resp: string) => c1!(r, p, resp),
    requestResponse: (r: string, p: any, resp = '') => c2!(r, p, resp),
  }))
  describe('createRequestResponseOperation', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should call requestResponse on the minimum load service', () => {
      const analytics = 'Analytics'
      const request = 'request'
      const getAnalytics = 'getAnalytics'
      const result = 'result'

      const serviceInstance = MockServiceInstanceStatus({
        serviceType: analytics,
        serviceId: 'A.1',
        serviceLoad: 0,
      })
      const serviceCollection = {
        getServiceInstanceWithMinimumLoad: () => serviceInstance,
        getServiceInstanceStatus: () => serviceInstance,
      }

      const requestResponse = jest.fn((r: string, p: any, resp: string) => of(result))
      const actionReference = { s: serviceCollection }
      const expectReference = { s: result }
      new MockScheduler().run(({ cold, expectObservable, flush }) => {
        const actionTimeLine = '-s-'
        const expectTimeLine = '-(s|)'

        const serviceInstanceDictionary$ = cold<IServiceStatusCollection>(
          actionTimeLine,
          actionReference,
        )
        const serviceStub = new MockServiceStub(undefined, requestResponse)
        const serviceStubWithLoadBalancer = new ServiceStubWithLoadBalancer(
          serviceStub as ServiceStub,
          serviceInstanceDictionary$,
        )

        const req$ = serviceStubWithLoadBalancer.createRequestResponseOperation(
          analytics,
          getAnalytics,
          request,
        )

        expectObservable(req$).toBe(expectTimeLine, expectReference)
        flush()
        expect(requestResponse).toHaveBeenCalledTimes(1)
        expect(requestResponse).toHaveBeenCalledWith(`A.1.${getAnalytics}`, request, '')
      })
    })
  })

  describe('createStreamOperation', () => {
    const blotter = 'Blotter'
    const remoteProcedure = 'B.547.getBlotter'
    const payload = { symbol: 'AAPL' }
    const responseTopic = `topic_${blotter}_tv203k`
    const request = 'getBlotter'
    const serviceInstance = MockServiceInstanceStatus({
      serviceType: blotter,
      serviceId: 'B.547',
      serviceLoad: 0,
    })
    let subscribeTopics$: any = null
    let requestResponse: any = null

    const serviceCollection = {
      getServiceInstanceWithMinimumLoad: () => serviceInstance,
      getServiceInstanceStatus: () => serviceInstance,
    }

    beforeEach(() => {
      subscribeTopics$ = jest.fn((r: string, p: any, resp: any) => {
        p.next(r)
        return of('result')
      })
      requestResponse = jest.fn((r: string, p: any, resp: any) => of('response'))
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should subscribe to the minimum load service', () => {
      const actionReference = { s: serviceCollection }
      new MockScheduler().run(({ cold, expectObservable, flush }) => {
        const actionTimeLine = '-s-'
        const expectTimeLine = '-(s|)'

        const serviceInstanceDictionary$ = cold<IServiceStatusCollection>(
          actionTimeLine,
          actionReference,
        )
        const serviceStub = new MockServiceStub(subscribeTopics$, requestResponse)
        const serviceStubWithLoadBalancer = new ServiceStubWithLoadBalancer(
          serviceStub as ServiceStub,
          serviceInstanceDictionary$,
        )

        const response$ = serviceStubWithLoadBalancer.createStreamOperation(blotter, request, {
          symbol: 'AAPL',
        })
        expectObservable(response$).toBe(expectTimeLine, { s: 'result' })
        flush()
        expect(subscribeTopics$).toHaveBeenCalledTimes(1)
      })
    })

    it('should on successful subscription call requestRemote with parameters remoteProcedure, payload, responseTopic', () => {
      const actionReference = { s: serviceCollection }
      const expectedReference = { s: 'result' }
      const topicGenerator = (service: string) => responseTopic
      new MockScheduler().run(({ cold, expectObservable, flush }) => {
        const actionTimeLine = '-s-'
        const expectTimeLine = '-(s|)'

        const serviceInstanceDictionary$ = cold<IServiceStatusCollection>(
          actionTimeLine,
          actionReference,
        )
        const serviceStub = new MockServiceStub(subscribeTopics$, requestResponse)
        const serviceStubWithLoadBalancer = new ServiceStubWithLoadBalancer(
          serviceStub as ServiceStub,
          serviceInstanceDictionary$,
        )

        const response$ = serviceStubWithLoadBalancer.createStreamOperation(
          blotter,
          request,
          payload,
          topicGenerator,
        )

        expectObservable(response$).toBe(expectTimeLine, expectedReference)
        flush()
        expect(subscribeTopics$).toHaveBeenCalledTimes(1)
        expect(requestResponse).toHaveBeenCalledTimes(1)
        expect(requestResponse).toHaveBeenCalledWith(remoteProcedure, payload, responseTopic)
      })
    })
  })
})
