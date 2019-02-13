import ServiceStubWithLoadBalancer from '../ServiceStubWithLoadBalancer'
import { MockScheduler } from 'rt-testing'
import { ServiceStub } from '../ServiceStub'
import { MockServiceCollectionMap, MockServiceInstanceCollection, MockServiceInstanceStatus } from '../__mocks__'
import { Observable, of } from 'rxjs'
import { ServiceCollectionMap } from 'rt-system'

describe('ServiceStubWithLoadBalancer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createRequestResponseOperation', () => {
    it('should call requestResponse with remoteProcedure and request', () => {
      const testScheduler = new MockScheduler()

      const s1 = MockServiceInstanceStatus({ serviceLoad: 1 })
      const s2 = MockServiceInstanceStatus({ serviceId: 'B.547', serviceLoad: 0 })
      const s3 = MockServiceInstanceStatus({ serviceId: 'C.57', serviceLoad: 3 })

      const serviceInstanceCollection = new MockServiceInstanceCollection(s1, s2, s3)
      const serviceCollection = new MockServiceCollectionMap(serviceInstanceCollection)

      const cb = jest.fn<Observable<string>>((r: string, p: any, resp: string) => of('result'))

      testScheduler.run(({ cold, expectObservable, flush }) => {
        const serviceInstanceDictionary$ = cold<ServiceCollectionMap>('-s-', { s: serviceCollection })
        const serviceStub = new MockServiceStub(cb)
        const serviceStubWithLoadBalancer = new ServiceStubWithLoadBalancer(serviceStub, serviceInstanceDictionary$)
        const req$ = serviceStubWithLoadBalancer.createRequestResponseOperation('Analytics', 'getAnalytics', 'request')
        expectObservable(req$).toBe('-(s|)', { s: 'result' })
        flush()
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith('B.547.getAnalytics', 'request', '')
      })
    })
  })

  describe('createStreamOperation', () => {
    it('', () => {
      const testScheduler = new MockScheduler()
      const s1 = MockServiceInstanceStatus({ serviceLoad: 1 })
      const s2 = MockServiceInstanceStatus({ serviceId: 'B.547', serviceLoad: 0 })
      const s3 = MockServiceInstanceStatus({ serviceId: 'C.57', serviceLoad: 3 })

      const serviceInstanceCollection = new MockServiceInstanceCollection(s1, s2, s3)
      const serviceCollection = new MockServiceCollectionMap(serviceInstanceCollection)

      testScheduler.run(({ expectObservable }) => {})
    })
  })
})
//remoteProcedure: string, payload: TPayload, responseTopic: string = ''
const MockServiceStub = jest.fn<ServiceStub>((callBack?: (r: string, p: any, resp: string) => Observable<any>) => ({
  subscribeToTopic: (r: string, p: any, resp: string) => callBack!(r, p, resp),
  requestResponse: (r: string, p: any, resp = '') => callBack!(r, p, resp),
}))
