import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { PlatformAdapter, OpenFin } from 'rt-components'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { Action } from 'redux'
import { PositionUpdates } from '../model'
import { AnalyticsActions } from '../actions'
import { MockScheduler } from 'rt-testing'
import { CurrencyPairPositionWithPrice, CurrencyPairPosition } from 'rt-types'
import { GlobalState } from 'StoreTypes'
import { DeepPartial } from 'rt-util'

const MockPlatformAdapter = jest.fn<PlatformAdapter>(() => ({
  interop: {
    subscribe: (sender: string, topic: string, listener: () => void) => jest.fn(() => 'values'),
    unsubscribe: (sender: string, topic: string, listener: () => void) => {},
  },
  excel: {
    isOpen: () => true,
    publishPositions: jest.fn((data: any) => {}),
    publishBlotter: jest.fn((data: any) => {}),
  },
  hasFeature: (featureName: string) => true,
}))

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

      if (platform.hasFeature('excel')) {
        expect(platform.excel.publishPositions).toHaveBeenCalledTimes(0)
      }
    })
  })

  it('should call platform publish on FetchAnalyticsAction with arguments publishUpdate and currentPositions', () => {
    const testScheduler = new MockScheduler()
    const platform: PlatformAdapter = new MockPlatformAdapter()
    const currencyPairPos: CurrencyPairPosition = {
      symbol: 'AAPL',
      basePnl: 10,
      baseTradedAmount: 120,
      basePnlName: 'basePnl',
      baseTradedAmountName: 'baseTradedAmount',
    }

    const mockGlobalStateWithSpotTileData: DeepPartial<GlobalState> = {
      spotTilesData: {
        [currencyPairPos.symbol]: {
          price: {
            ask: 2,
            bid: 1,
          },
        },
      },
    }

    const currencyPairPosWithPrice: CurrencyPairPositionWithPrice = {
      ...currencyPairPos,
      latestAsk: mockGlobalStateWithSpotTileData.spotTilesData[currencyPairPos.symbol].price.ask,
      latestBid: mockGlobalStateWithSpotTileData.spotTilesData[currencyPairPos.symbol].price.bid,
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
      const state$ = { value: mockGlobalStateWithSpotTileData } as StateObservable<GlobalState>
      const epics$ = publishPositionUpdateEpic(action$, state$, { platform })

      expectObservable(epics$).toBe(expectedAction)
      flush()

      if (platform.hasFeature('excel')) {
        expect(platform.excel.publishPositions).toHaveBeenCalledTimes(1)
        expect(platform.excel.publishPositions).toHaveBeenCalledWith([currencyPairPosWithPrice])
      }
    })
  })
})
