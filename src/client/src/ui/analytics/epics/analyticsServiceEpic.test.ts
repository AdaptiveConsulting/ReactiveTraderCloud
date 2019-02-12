import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { TestScheduler } from 'rxjs/testing'
import { PlatformAdapter } from 'rt-components'
import { AnalyticsActions } from '../actions'
import { ActionsObservable } from 'redux-observable'
import { ApplicationDependencies } from 'applicationServices'
import { Action } from 'redux'
import { PositionUpdates } from '../model'

const MockPlatformAdapter = jest.fn<PlatformAdapter>(() => ({
  window: {
    close: () => jest.fn(),
    maximize: () => jest.fn(),
    minimize: () => jest.fn(),
    resize: () => jest.fn(),
  },
  interop: {
    subscribe: (sender: string, topic: string, listener: () => void) => jest.fn(() => 'values'),
    unsubscribe: (sender: string, topic: string, listener: () => void) => {},
    publish: jest.fn((topic: string, message: any) => {}),
  },
  notification: {
    notify: (message: object) => jest.fn(),
  },
}))

describe('publishPositionUpdateEpic', () => {
  it('should ignore actions that are not FetchAnalytics', () => {
    // const testScheduler = new TestScheduler((actual, expected) => {
    //   expect(actual).toEqual(expected)
    // })
    // testScheduler.run(({ cold, expectObservable }) => {
    //   const randomAction = AnalyticsActions.subcribeToAnalytics
    //   const coldAction = cold<Action<any>>('--a--|', { a: { type: randomAction } })
    //   const action$ = ActionsObservable.from(coldAction, testScheduler)
    //   const epics$ = publishPositionUpdateEpic(action$, undefined, {
    //     platform: new MockPlatformAdapter(),
    //   } as ApplicationDependencies)
    //   expectObservable(epics$).toBe('-----|')
    // })
  })

  it('should only accept action of type FetchAnalytics  ', () => {})
  it('should only emit nothing when action is of type FetchAnalytics', () => {})

  it('calls platform publish on FetchAnalyticsAction with arguments publishUpdate and currentPositions', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      console.log(actual, expected)
      expect(actual).toEqual(expected)
    })
    testScheduler.run(({ cold, expectObservable }) => {
      const { fetchAnalytics } = AnalyticsActions
      const payload: PositionUpdates = {
        currentPositions: [],
        history: [],
      }
      const st = fetchAnalytics(payload)
      const coldAction = cold<Action<any>>('--a-a-|', { a: { type: 'Lala' } })
      const action$ = ActionsObservable.from(coldAction, testScheduler)
      action$.subscribe(x => console.log('Lala' + x))
      const platform = new MockPlatformAdapter()
      const appDependencies = new MockApplicationDependency(platform)
      const epics$ = publishPositionUpdateEpic(action$, undefined, appDependencies)
      // platform.interop.publish('', '')
      // console.log(platform.interop.publish)
      expect(platform.interop!.publish).toHaveBeenCalledTimes(1)
      // expect(platform.interop.publish).toHaveBeenCalledWith(['position-update', []]) //toBeCalledWith('position-update', [])
      expectObservable(epics$).toBe('------|')
    })
  })

  const MockApplicationDependency = jest.fn<ApplicationDependencies>(
    (referenceDataService?, platform?, limitChecker?, loadBalancedServiceStub?, serviceStatus$?, connection$?) => ({
      referenceDataService,
      platform,
      limitChecker,
      loadBalancedServiceStub,
      serviceStatus$,
      connection$,
    }),
  )
})

/**
 * TODO
 * Mock state, mock platform, mock ActionObservable
 */

/**
 * listens to type of action FetchAnalytics
 * action, we also want to get the
 */
