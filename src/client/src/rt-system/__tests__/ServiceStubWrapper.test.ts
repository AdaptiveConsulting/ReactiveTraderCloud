import ServiceStubWrapper from '../ServiceStubWrapper'
import { MockScheduler } from 'rt-testing'
import { Observable, of } from 'rxjs'
import { IServiceStatusCollection, ServiceStub } from 'rt-system'

describe('ServiceStubWrapper', () => {
  type CallBack = (r: string, p: any) => Observable<any>

  const MockServiceStub = jest.fn((c1?: CallBack, c2?: CallBack, c3?: CallBack) => ({
    requestStream: (r: string, p: any) => c3!(r, p),
  }))
  describe('createStreamOperation', () => {
    const blotter = 'blotter'
    const remoteProcedure = 'blotter.getBlotter'
    const payload = { symbol: 'AAPL' }
    const request = 'getBlotter'
    let subscribeTopics$: any = null
    let requestResponse: any = null
    let requestStream$: any = null

    const serviceCollection = {
      getServiceNumberOfInstances: () => 1,
    }

    beforeEach(() => {
      requestStream$ = jest.fn((r: string) => of('response'))
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should subscribe to the minimum load service', () => {
      const actionReference = { s: serviceCollection }
      new MockScheduler().run(({ cold, expectObservable, flush }) => {
        const actionTimeLine = '-s-'
        const expectTimeLine = '-(s)-'

        const serviceInstanceDictionary$ = cold<IServiceStatusCollection>(
          actionTimeLine,
          actionReference,
        )
        const serviceStub = new MockServiceStub(subscribeTopics$, requestResponse, requestStream$)
        const serviceStubWrapper = new ServiceStubWrapper(
          serviceStub as ServiceStub,
          serviceInstanceDictionary$,
        )

        const response$ = serviceStubWrapper.createStreamOperation(blotter, request, {
          symbol: 'AAPL',
        })
        expectObservable(response$).toBe(expectTimeLine, { s: 'response' })
        flush()
        expect(requestStream$).toHaveBeenCalledTimes(1)
      })
    })

    it('should on successful subscription call requestRemote with parameters remoteProcedure, payload', () => {
      const actionReference = { s: serviceCollection }
      const expectedReference = { s: 'response' }
      new MockScheduler().run(({ cold, expectObservable, flush }) => {
        const actionTimeLine = '-s-'
        const expectTimeLine = '-(s)-'

        const serviceInstanceDictionary$ = cold<IServiceStatusCollection>(
          actionTimeLine,
          actionReference,
        )
        const serviceStub = new MockServiceStub(subscribeTopics$, requestResponse, requestStream$)
        const serviceStubWrapper = new ServiceStubWrapper(
          serviceStub as ServiceStub,
          serviceInstanceDictionary$,
        )

        const response$ = serviceStubWrapper.createStreamOperation(blotter, request, payload)

        expectObservable(response$).toBe(expectTimeLine, expectedReference)
        flush()
        expect(requestStream$).toHaveBeenCalledTimes(1)
        expect(requestStream$).toHaveBeenCalledWith(remoteProcedure, payload)
      })
    })
  })
})
