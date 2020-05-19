import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'
import { SpotTileData } from './model'
import { CurrencyPair } from 'rt-types'
import { PriceMovementTypes } from './model/priceMovementTypes'

const DEFAULT_TILE_DATA: SpotTileData = {
  isTradeExecutionInFlight: false,
  historicPrices: [],
  price: {
    ask: 0,
    bid: 0,
    mid: 0,
    creationTimestamp: 0,
    symbol: '',
    valueDate: '',
    priceMovementType: PriceMovementTypes.None,
    priceStale: false
  },
  lastTradeExecutionStatus: null,
  rfqState: 'none',
  rfqPrice: null,
  rfqReceivedTime: null,
  rfqTimeout: null
}

const getCurrencyPair = (
  state: GlobalState,
  currencyPairId: string | undefined
): CurrencyPair | undefined =>
  typeof currencyPairId === 'undefined' ? undefined : state.currencyPairs[currencyPairId]

const selectCurrencyPair = createSelector([getCurrencyPair], currencyPair => currencyPair)

const getSpotTileData = (
  state: GlobalState,
  currencyPairId: string | undefined
): SpotTileData | undefined =>
  typeof currencyPairId === 'undefined' ? undefined : state.spotTilesData[currencyPairId]

const selectSpotTileData = createSelector(
  getSpotTileData,
  (spotTileData: SpotTileData | undefined) => spotTileData || DEFAULT_TILE_DATA
)

const getPricingStatus = (state: GlobalState) =>
  state.compositeStatusService &&
  state.compositeStatusService.pricing &&
  state.compositeStatusService.pricing.connectionStatus
const selectPricingStatus = createSelector([getPricingStatus], serviceStatus => serviceStatus)

const getExecutionStatus = (state: GlobalState) =>
  state.compositeStatusService &&
  state.compositeStatusService.execution &&
  state.compositeStatusService.execution.connectionStatus
const selectExecutionStatus = createSelector([getExecutionStatus], serviceStatus => serviceStatus)

export { selectCurrencyPair, selectSpotTileData, selectExecutionStatus, selectPricingStatus }
