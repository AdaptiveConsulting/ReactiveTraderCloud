import React, { Component } from 'react'
import { Action } from 'redux'
import { CurrencyPair } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData } from '../model'
import { TileBooking } from './notifications'
import NotificationContainer from './notifications'
import SpotTile from './SpotTile'
import TileControls from './TileControls'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  tornOff?: boolean
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => Action
  onPopoutClick?: () => void
  onNotificationDismissed: () => void
  displayCurrencyChart?: () => void
}

export default class TileSwitch extends Component<Props> {
  render() {
    const {
      currencyPair,
      spotTileData,
      executeTrade,
      tornOff,
      onPopoutClick,
      onNotificationDismissed,
      displayCurrencyChart
    } = this.props
    if (!spotTileData || !spotTileData.price || !currencyPair) {
      return null
    }
    const { lastTradeExecutionStatus, isTradeExecutionInFlight } = spotTileData
    const isPriceStale = !lastTradeExecutionStatus && spotTileData.price && spotTileData.price.priceStale
    return (
      <SpotTile currencyPair={currencyPair} spotTileData={spotTileData} executeTrade={executeTrade}>
        {<TileControls canPopout={tornOff} onPopoutClick={onPopoutClick} displayCurrencyChart={displayCurrencyChart} />}
        <TileBooking show={isTradeExecutionInFlight} />
        <NotificationContainer
          isPriceStale={isPriceStale}
          lastTradeExecutionStatus={lastTradeExecutionStatus}
          currencyPair={currencyPair}
          onNotificationDismissed={onNotificationDismissed}
        />
      </SpotTile>
    )
  }
}
