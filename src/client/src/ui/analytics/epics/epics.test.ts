import { MockScheduler } from 'rt-testing'
import { ReferenceActions, ConnectionActions } from 'rt-actions'
import { analyticsServiceEpic } from './epics'
import { ActionsObservable } from 'redux-observable'
import { AnalyticsActions } from '../actions'
import { Action } from 'redux'
import { MockServiceClient } from 'rt-system/__mocks__'
import { of } from 'rxjs'
import { map } from 'rxjs/operators'

const position = {
  CurrentPositions: [],
  History: [],
}
const serviceType = '@ReactiveTraderCloud/ANALYTICS_SERVICE'

describe('Analytics epics', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should only emit after it subscribes and references the service', () => {
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

      const loadBalancedServiceStub = new MockServiceClient(createStreamOperation$)

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

      const loadBalancedServiceStub = new MockServiceClient(createStreamOperation$)

      const action$ = ActionsObservable.from(coldAction$, testScheduler)
      const epics$ = analyticsServiceEpic(action$, undefined, { loadBalancedServiceStub }).pipe(
        map(x => x.type === serviceType),
      )
      expectObservable(epics$).toBe(expecteLifetime, { a: true })
    })
  })
})
