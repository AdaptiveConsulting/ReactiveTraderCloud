import { MockScheduler } from 'rt-testing'
import { ReferenceActions, ConnectionActions } from 'rt-actions'
import { analyticsServiceEpic } from './epics'
import { ActionsObservable } from 'redux-observable'
import { AnalyticsActions } from '../actions'
import { Action } from 'redux'
import { of, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ServiceStubWithLoadBalancer } from 'rt-system'

const position = {
  CurrentPositions: [] as any[],
  History: [] as any[],
}
const serviceType = '@ReactiveTraderCloud/ANALYTICS_SERVICE'

describe('Analytics epics', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should emit only after it has subscribed and has a reference to the analytics service', () => {
    const testScheduler = new MockScheduler()

    const referenceAction = ReferenceActions.createReferenceServiceAction({})
    const subscribeAction = AnalyticsActions.subcribeToAnalytics()

    const actionsReference = {
      r: referenceAction,
      s: subscribeAction,
      a: position,
    }
    const createStreamOperation$ = jest.fn((s: string, o: string, r: any) => of(position))

    testScheduler.run(({ cold, expectObservable }) => {
      const actionlifteTime = '-a-a-(rs)a--'
      const expecteLifetime = '-----a--'

      const loadBalancedServiceStub: ServiceStubWithLoadBalancer = new MockServiceStubWithLoadBalancer(
        createStreamOperation$,
      ) as ServiceStubWithLoadBalancer

      const coldAction$ = cold<Action<any>>(actionlifteTime, actionsReference)
      const action$ = ActionsObservable.from(coldAction$, testScheduler)
      const epics$ = analyticsServiceEpic(action$, undefined, { loadBalancedServiceStub }).pipe(
        map(x => x.type === serviceType),
      )
      expectObservable(epics$).toBe(expecteLifetime, { a: true })
    })
  })

  it('should not emit action after application has been disconnected', () => {
    const testScheduler = new MockScheduler()

    const referenceAction = ReferenceActions.createReferenceServiceAction({})
    const subscribeAction = AnalyticsActions.subcribeToAnalytics()
    const disconnectAction = ConnectionActions.disconnect()
    const actionsReference = {
      r: referenceAction,
      s: subscribeAction,
      d: disconnectAction,
      a: position,
    }
    const createStreamOperation$ = jest.fn((s: string, o: string, r: any) => of(position))

    testScheduler.run(({ cold, expectObservable }) => {
      const actionlifteTime = '(rs)-a-d-aa-'
      const expecteLifetime = 'a-----'

      const coldAction$ = cold<Action<any>>(actionlifteTime, actionsReference)

      const loadBalancedServiceStub: ServiceStubWithLoadBalancer = (new MockServiceStubWithLoadBalancer(
        createStreamOperation$,
      ) as any) as ServiceStubWithLoadBalancer

      const action$ = ActionsObservable.from(coldAction$, testScheduler)
      const epics$ = analyticsServiceEpic(action$, undefined, { loadBalancedServiceStub }).pipe(
        map(x => x.type === serviceType),
      )
      expectObservable(epics$).toBe(expecteLifetime, { a: true })
    })
  })
})

const implementation = (
  getResponses: (service: string, operationName: string, request: any) => Observable<any>,
) => ({
  createStreamOperation: (s: string, o: string, r: any) => getResponses(s, o, r),
})
const MockServiceStubWithLoadBalancer = jest.fn<
  Partial<ServiceStubWithLoadBalancer>,
  Parameters<typeof implementation>
>(implementation)
