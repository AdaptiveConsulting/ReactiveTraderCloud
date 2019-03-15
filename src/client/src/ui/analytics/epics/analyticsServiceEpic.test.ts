import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { PlatformAdapter, OpenFin } from 'rt-components'
import { ActionsObservable } from 'redux-observable'
import { Action } from 'redux'
import { PositionUpdates, CurrencyPairPosition } from '../model'
import { AnalyticsActions } from '../actions'
import { MockScheduler } from 'rt-testing'

const MockPlatformAdapter = jest.fn<PlatformAdapter>(() => ({
  interop: {
    subscribe: (sender: string, topic: string, listener: () => void) => jest.fn(() => 'values'),
    unsubscribe: (sender: string, topic: string, listener: () => void) => {},
    publish: (topic: string, message: any) => {},
  },
  excel: {
    publish: jest.fn((topic: string, message: any) => topic),
  },
  hasFeature: (featureName: string) => true,
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

      expect((platform as OpenFin).excel.publish).toHaveBeenCalledTimes(0)
    })
  })

  it('should call platform publish on FetchAnalyticsAction with arguments publishUpdate and currentPositions', () => {
    const testScheduler = new MockScheduler()
    const platform = new MockPlatformAdapter()
    const currencyPairPos: CurrencyPairPosition = {
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

      if (platform.hasFeature('excel')) {
        expect(platform.excel.publish).toHaveBeenCalledTimes(1)
        expect(platform.excel.publish).toHaveBeenCalledWith(Update, [currencyPairPos])
      }
    })
  })
})
