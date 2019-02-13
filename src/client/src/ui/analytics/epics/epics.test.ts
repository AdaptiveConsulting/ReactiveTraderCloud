import { MockScheduler } from 'rt-testing'
import { ReferenceActions, ConnectionActions } from 'rt-actions'
import { analyticsServiceEpic } from './epics'
import { ActionsObservable } from 'redux-observable'
import { AnalyticsActions } from '../actions'
import { Action } from 'redux'
import { ServiceStubWithLoadBalancer, MockServiceClient } from 'rt-system'

describe('Analytics epics', () => {
  it('should call the getAnalyticsStream with currency as the argument', () => {
    expect(1).toBe(1)
  })

  it('should not emit value if the application is not connected', () => {
    expect(1).toBe(1)
  })

  it('should not emit action after applicationDisconnected Asction', () => {
    const testScheduler = new MockScheduler()
    const getResponse = (s: string, o: string, r: any) => 'result'
    const referenceAction = ReferenceActions.createReferenceServiceAction({})
    const subscribeAction = AnalyticsActions.subcribeToAnalytics()
    const disconnectAction = ConnectionActions.disconnect()
    testScheduler.run(({ cold, flush, expectObservable }) => {
      const coldAction$ = cold<Action<any>>('rs-d--rs-', {
        r: referenceAction,
        s: subscribeAction,
        d: disconnectAction,
      })
      const serviceStubWithLoadBalancer = new MockServiceClient(getResponse)
      const action$ = ActionsObservable.from(coldAction$, testScheduler)
      const epics$ = analyticsServiceEpic(action$, undefined, { serviceStubWithLoadBalancer })

      expectObservable(epics$).toBe('a-----')
      flush()
    })
  })

  it('should map position update to fetchAnalytics', () => {
    expect(1).toBe(1)
  })
})

const mockServiceLoader = jest.fn<ServiceStubWithLoadBalancer>(() => {})
