import { publishPositionToExcelEpic } from './analyticsServiceEpic'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { Action } from 'redux'
import { PositionUpdates } from '../model'
import { AnalyticsActions } from '../actions'
import { MockScheduler } from 'rt-testing'
import { CurrencyPairPositionWithPrice, CurrencyPairPosition } from 'rt-types'
import { GlobalState } from 'StoreTypes'
import { DeepPartial } from 'rt-util'
import { ExcelApp } from 'rt-platforms'

const MockExcelApp = jest.fn<ExcelApp, []>(() => ({
  name: 'xxx',
  isOpen: () => true,
  open: () => Promise.resolve(),
  publishPositions: jest.fn((data: any) => Promise.resolve()),
  publishBlotter: jest.fn((data: any) => Promise.resolve()),
}))

describe('publishPositionToExcelEpic', () => {
  it('should ignore actions that are not FetchAnalytics', () => {
    const testScheduler = new MockScheduler()
    const excelApp = new MockExcelApp()

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
      const epics$ = publishPositionToExcelEpic(action$, undefined, { excelApp })

      expectObservable(epics$).toBe(expectedAction)
      flush()

      expect(excelApp.publishPositions).toHaveBeenCalledTimes(0)
    })
  })

  it('should call platform publish on FetchAnalyticsAction with arguments publishUpdate and currentPositions', () => {
    const testScheduler = new MockScheduler()
    const excelApp: ExcelApp = new MockExcelApp()
    const currencyPairPos: CurrencyPairPosition = {
      symbol: 'AAPL',
      basePnl: 10,
      baseTradedAmount: 120,
      basePnlName: 'basePnl',
      baseTradedAmountName: 'baseTradedAmount',
      counterTradedAmount: 100,
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
      const epics$ = publishPositionToExcelEpic(action$, state$, { excelApp })

      expectObservable(epics$).toBe(expectedAction)
      flush()

      expect(excelApp.publishPositions).toHaveBeenCalledTimes(1)
      expect(excelApp.publishPositions).toHaveBeenCalledWith([currencyPairPosWithPrice])
    })
  })
})
