import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { PlatformAdapter } from 'rt-components'
import { ActionsObservable } from 'redux-observable'
import { Action } from 'redux'
import { PositionUpdates } from '../model'
import { AnalyticsActions } from '../actions'
import { MockScheduler } from 'rt-testing'
import { CurrencyPairPosition } from '../model/currencyPairPosition'

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
    const testScheduler = new MockScheduler()
    const platform = new MockPlatformAdapter()

    testScheduler.run(({ cold, expectObservable, flush }) => {
      const coldAction = cold<Action<any>>('--a-b-a-|', {
        a: { type: 'Random1' },
        b: { type: 'Random2' },
      })
      const action$ = ActionsObservable.from(coldAction, testScheduler)
      const epics$ = publishPositionUpdateEpic(action$, undefined, { platform })
      expectObservable(epics$).toBe('--------|')
      flush()
      expect(platform.interop!.publish).toHaveBeenCalledTimes(0)
    })
  })

  it('should correctly map currencyPairPosition if action is of type FetchAnalytics ', () => {
    const testScheduler = new MockScheduler()
    const platform = new MockPlatformAdapter()
    const currencyPairPos = {
      symbol: 'AAPL',
      basePnl: 10,
      baseTradedAmount: 120,
      basePnlName: 'basePnl',
      baseTradedAmountName: 'baseTradedAmount',
    } as CurrencyPairPosition

    const payload: PositionUpdates = {
      currentPositions: [currencyPairPos],
      history: [],
    }
    const expected = {
      symbol: currencyPairPos.symbol,
      basePnl: currencyPairPos.basePnl,
      baseTradedAmount: currencyPairPos.baseTradedAmount,
    }
    testScheduler.run(({ cold, expectObservable, flush }) => {
      const coldAction = cold<Action<any>>('--a--|', {
        a: AnalyticsActions.fetchAnalytics(payload),
      })
      const action$ = ActionsObservable.from(coldAction, testScheduler)
      const epics$ = publishPositionUpdateEpic(action$, undefined, { platform })
      expectObservable(epics$).toBe('-----|')
      flush()
      expect(platform.interop!.publish).toHaveBeenCalledTimes(1)
      expect(platform.interop!.publish).toHaveBeenCalledWith('position-update', [expected])
    })
  })

  it('should call platform publish on FetchAnalyticsAction with arguments publishUpdate and currentPositions', () => {
    const testScheduler = new MockScheduler()
    const payload: PositionUpdates = {
      currentPositions: [],
      history: [],
    }
    const platform = new MockPlatformAdapter()

    testScheduler.run(({ cold, expectObservable, flush }) => {
      const coldAction = cold<Action<any>>('--a--|', {
        a: AnalyticsActions.fetchAnalytics(payload),
      })
      const action$ = ActionsObservable.from(coldAction, testScheduler)

      const epics$ = publishPositionUpdateEpic(action$, undefined, { platform })

      expectObservable(epics$).toBe('-----|')
      flush()

      expect(platform.interop!.publish).toHaveBeenCalledTimes(1)
      expect(platform.interop!.publish).toHaveBeenCalledWith('position-update', [])
    })
  })
})
