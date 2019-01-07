import React from 'react'
import { CurrencyPair, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData } from '../model'
import { PriceMovementTypes } from '../model/priceMovementTypes'
import { TileBooking } from './notifications'
import NotificationContainer from './notifications'
// import SpotTile from './SpotTile'
import Tile from './Tile'
import TileControls from './TileControls'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  canPopout: boolean
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  onPopoutClick?: () => void
  onNotificationDismissed: () => void
  displayCurrencyChart?: () => void
  tileView?: string
}

const TileSwitch: React.SFC<Props> = ({
  currencyPair,
  spotTileData,
  executeTrade,
  canPopout,
  onPopoutClick,
  onNotificationDismissed,
  displayCurrencyChart,
  executionStatus,
  tileView,
}) => (
  <Tile
    currencyPair={currencyPair}
    spotTileData={spotTileData}
    executeTrade={executeTrade}
    executionStatus={executionStatus}
    tileView={tileView}
  >
    <TileControls canPopout={canPopout} onPopoutClick={onPopoutClick} displayCurrencyChart={displayCurrencyChart} />
    <TileBooking show={spotTileData.isTradeExecutionInFlight} />
    <NotificationContainer
      isPriceStale={!spotTileData.lastTradeExecutionStatus && spotTileData.price.priceStale}
      lastTradeExecutionStatus={spotTileData.lastTradeExecutionStatus}
      currencyPair={currencyPair}
      onNotificationDismissed={onNotificationDismissed}
    />
  </Tile>
)

TileSwitch.defaultProps = {
  spotTileData: {
    isTradeExecutionInFlight: false,
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
  },
  currencyPair: {
    symbol: '',
    ratePrecision: 0,
    pipsPosition: 0,
    base: '',
    terms: '',
  },
}

export default TileSwitch
