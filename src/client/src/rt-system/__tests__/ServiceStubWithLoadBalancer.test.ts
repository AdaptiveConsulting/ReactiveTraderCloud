import ServiceStubWithLoadBalancer from '../ServiceStubWithLoadBalancer'
import { MockScheduler } from 'rt-testing'
import { ServiceStub } from '../ServiceStub'
import { MockServiceCollectionMap, MockServiceInstanceCollection, MockServiceInstanceStatus } from '../__mocks__'
import { of, Observable } from 'rxjs'

describe('ServiceStubWithLoadBalancer', () => {
  describe('createRequestResponseOperation', () => {
    it('should call requestResponse with remoteProcedure and request', () => {
      const testScheduler = new MockScheduler()
      const s1 = MockServiceInstanceStatus({ serviceLoad: 1 })
      const s2 = MockServiceInstanceStatus({ serviceId: 'B.547', serviceLoad: 0 })
      const s3 = MockServiceInstanceStatus({ serviceId: 'C.57', serviceLoad: 3 })
      const serviceInstanceCollection = new MockServiceInstanceCollection(s1, s2, s3)
      const serviceCollection = new MockServiceCollectionMap(serviceInstanceCollection)

      testScheduler.run(({ cold, expectObservable }) => {
        const serviceInstanceDictionary$ = of(serviceCollection)
        const serviceStub = new MockServiceStub()
      })
    })

    it('should emit to all of its observables', () => {})
  })

  describe('createStreamOperation', () => {
    it('', () => {})
  })
})
//remoteProcedure: string, payload: TPayload, responseTopic: string = ''
const MockServiceStub = jest.fn<ServiceStub>((callBack?: (r: string, p: any, resp: string) => Observable<any>) => ({
  subscribeToTopic: (r: string, p: any, resp: string) => callBack!(r, p, resp),
  requestResponse: (r: string, p: any, resp: string) => callBack!(r, p, resp),
}))
