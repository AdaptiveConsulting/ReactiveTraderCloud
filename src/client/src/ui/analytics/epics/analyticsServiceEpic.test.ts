import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { PlatformAdapter } from 'rt-components'
import { ActionsObservable } from 'redux-observable'
import { Action } from 'redux'
import { PositionUpdates } from '../model'
import { AnalyticsActions } from '../actions'
import { MockScheduler } from 'rt-testing'

const MockPlatformAdapter = jest.fn<PlatformAdapter>(() => ({
  interop: {
    subscribe: (sender: string, topic: string, listener: () => void) => jest.fn(() => 'values'),
    unsubscribe: (sender: string, topic: string, listener: () => void) => {},
    publish: jest.fn((topic: string, message: any) => {}),
  },
}))

const Update = 'position-update'

describe('publishPositionUpdateEpic', () => {
  it('should ignore actions that are not FetchAnalytics', () => {
    const testScheduler = new MockScheduler()
    const platform = new MockPlatformAdapter()

    const randomAction = 'random'
    const actionReference = {
      a: { type: `${randomAction}1` },
      b: { type: `${randomAction}2` },
    }

    testScheduler.run(({ cold, expectObservable, flush }) => {
      const actionLifetime = '--a-b-a-|'
      const expectedAction = '--------|'

      const coldAction = cold<Action<any>>(actionLifetime, actionReference)

      const action$ = ActionsObservable.from(coldAction, testScheduler)
      const epics$ = publishPositionUpdateEpic(action$, undefined, { platform })

      expectObservable(epics$).toBe(expectedAction)
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
    }

    const payload: PositionUpdates = {
      currentPositions: [currencyPairPos],
      history: [],
    }
    const expected = {
      symbol: currencyPairPos.symbol,
      basePnl: currencyPairPos.basePnl,
      baseTradedAmount: currencyPairPos.baseTradedAmount,
    }

    const actionReference = {
      a: AnalyticsActions.fetchAnalytics(payload),
    }

    testScheduler.run(({ cold, expectObservable, flush }) => {
      const actionLifetime = '--a--|'
      const expectedAction = '-----|'

      const coldAction = cold<Action<any>>(actionLifetime, actionReference)

      const action$ = ActionsObservable.from(coldAction, testScheduler)
      const epics$ = publishPositionUpdateEpic(action$, undefined, { platform })

      expectObservable(epics$).toBe(expectedAction)
      flush()

      expect(platform.interop!.publish).toHaveBeenCalledTimes(1)
      expect(platform.interop!.publish).toHaveBeenCalledWith(Update, [expected])
    })
  })

  it('should call platform publish on FetchAnalyticsAction with arguments publishUpdate and currentPositions', () => {
    const testScheduler = new MockScheduler()
    const payload: PositionUpdates = {
      currentPositions: [],
      history: [],
    }
    const platform = new MockPlatformAdapter()
    const actionReference = {
      a: AnalyticsActions.fetchAnalytics(payload),
    }

    testScheduler.run(({ cold, expectObservable, flush }) => {
      const actionLifetime = '--a--|'
      const expectedAction = '-----|'

      const coldAction = cold<Action<any>>(actionLifetime, actionReference)
      const action$ = ActionsObservable.from(coldAction, testScheduler)

      const epics$ = publishPositionUpdateEpic(action$, undefined, { platform })

      expectObservable(epics$).toBe(expectedAction)
      flush()

      expect(platform.interop!.publish).toHaveBeenCalledTimes(1)
      expect(platform.interop!.publish).toHaveBeenCalledWith(Update, [])
    })
  })
})
