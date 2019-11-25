import { GlobalState } from 'StoreTypes'
import { selectSpotTileData } from './selectors'
import { SpotTileData, SpotTileDataWithNotional } from './model'
import { ConnectionStatus } from 'rt-system'
import { PriceMovementTypes } from './model/priceMovementTypes'

const getDefaultGlobalState = (): GlobalState => ({
  analyticsService: {
    history: [],
    currentPositions: [],
  },
  blotterService: {
    trades: [],
  },
  compositeStatusService: {},
  connectionStatus: {
    status: ConnectionStatus.connected,
    transportType: 'unknown',
    url: '',
  },
  currencyPairs: {},
  layoutService: {
    analytics: {
      visible: true,
      x: 0,
      y: 0,
    },
    blotter: {
      visible: true,
      x: 0,
      y: 0,
    },
    spotTiles: {},
  },
  spotTilesData: {},
})

const getDefaultSpotTileData = (): SpotTileData => ({
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
    priceStale: false,
  },
  currencyChartIsOpening: false,
  lastTradeExecutionStatus: null,
  rfqState: 'none',
  rfqPrice: null,
  rfqReceivedTime: null,
  rfqTimeout: null,
})

describe('selectSpotTileData', () => {
  it('should set default notional to 1,000,000 for GBPUSD', () => {
    const globalState: GlobalState = {
      ...getDefaultGlobalState(),
      currencyPairs: {
        GBPUSD: {
          symbol: 'GBPUSD',
          ratePrecision: 2,
          pipsPosition: 2,
          base: '',
          terms: '',
        },
      },
    }

    const spotTileData = selectSpotTileData(globalState, 'GBPUSD')
    const expectedTileDataForGBPUSD: SpotTileDataWithNotional = {
      ...getDefaultSpotTileData(),
      notional: 1000000,
    }

    expect(spotTileData).toEqual(expectedTileDataForGBPUSD)
  })

  it('should set default notional to 1,000,000 for undefined currency', () => {
    const globalState: GlobalState = {
      ...getDefaultGlobalState(),
    }

    const spotTileData = selectSpotTileData(globalState, undefined)
    const expectedTileData: SpotTileDataWithNotional = {
      ...getDefaultSpotTileData(),
      notional: 1000000,
    }

    expect(spotTileData).toEqual(expectedTileData)
  })

  it('should set default notional to 10,000,000 for NZDUSD', () => {
    const globalState: GlobalState = {
      ...getDefaultGlobalState(),
      currencyPairs: {
        NZDUSD: {
          symbol: 'NZDUSD',
          ratePrecision: 2,
          pipsPosition: 2,
          base: '',
          terms: '',
        },
      },
    }

    const spotTileData = selectSpotTileData(globalState, 'NZDUSD')
    const expectedTileDataForGBPUSD: SpotTileDataWithNotional = {
      ...getDefaultSpotTileData(),
      notional: 10000000,
    }

    expect(spotTileData).toEqual(expectedTileDataForGBPUSD)
  })
})
