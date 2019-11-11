import { publishPositionToExcelEpic } from './analyticsServiceEpic'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { Action } from 'redux'
import { PositionUpdates } from '../model'
import { AnalyticsActions } from '../actions'
import { MockScheduler } from 'rt-testing'
import { CurrencyPairPosition, CurrencyPairPositionWithPrice } from 'rt-types'
import { GlobalState } from 'StoreTypes'
import { ExcelApp } from 'rt-platforms'
import { selectSpotTileData } from './selectors';


describe('selectSpotTileData', () => {
  it('should set default notional to 0', () => {

    selectSpotTileData()

  })
})
