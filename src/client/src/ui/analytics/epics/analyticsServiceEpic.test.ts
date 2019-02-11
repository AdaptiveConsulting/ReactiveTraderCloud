import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { TestScheduler } from 'rxjs/testing'
import { map } from 'rxjs/operators'
import { PlatformAdapter } from 'rt-components'
import { AnalyticsActions } from '../actions'
import { ActionsObservable } from 'redux-observable'
import { ApplicationDependencies } from 'applicationServices'

const MockPlatformAdapter = jest.fn<PlatformAdapter>(() => ({
  window: {
    close: () => jest.fn(),
    maximize: () => jest.fn(),
    minimize: () => jest.fn(),
    resize: () => jest.fn(),
  },
  interop: {
    subscribe: (sender: string, topic: string, listener: () => void) => jest.fn(),
    unsubscribe: (sender: string, topic: string, listener: () => void) => jest.fn(),
    publish: (topic: string, message: any) => jest.fn(),
  },
  notification: {
    notify: (message: object) => jest.fn(),
  },
}))

describe('publishPositionUpdateEpic', () => {
  it('should ignore actions that are not FetchAnalytics', () => {
    const randomAction = AnalyticsActions.subcribeToAnalytics
    const action$ = ActionsObservable.of({
      type: randomAction,
    })
    const epics$ = publishPositionUpdateEpic(action$, undefined, {
      platform: new MockPlatformAdapter(),
    } as ApplicationDependencies)
  })

  it('should map object of type  ', () => {})

  it('calls platform publish on FetchAnalyticsAction with arguments publishUpdate and currentPositions', () => {})

  it('foo test', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      console.log(actual, expected)
      expect(actual).toEqual(expected)
    })
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold<number>('--a--b|', { a: 5, b: 10 })
      const expectedMarble = '--x--y|'
      const expectedValue = { x: 10, y: 20 }
      const result$ = source$.pipe(map(x => x * 2))
      expectObservable(result$).toBe(expectedMarble, expectedValue)
    })
  })
})

/**
 * TODO
 * Mock state, mock platform, mock ActionObservable
 */
