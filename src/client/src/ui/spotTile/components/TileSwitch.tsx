import React, { Component } from 'react'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotTileData } from '../model/spotTileData'
import { TileBooking } from './notifications'
import NotificationContainer from './notifications'
import SpotTile from './SpotTile'
import TileControls from './TileControls'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  tornOff: boolean
  executeTrade: (direction: Direction, notional: number) => void
  onPopoutClick?: () => void
  onNotificationDismissedClick: () => void
}

export default class TileSwitch extends Component<Props> {
  render() {
    const {
      currencyPair,
      spotTileData,
      executeTrade,
      tornOff,
      onPopoutClick,
      onNotificationDismissedClick
    } = this.props

    if (!spotTileData || !spotTileData.price || !currencyPair) {
      return null
    }

    const { lastTradeExecutionStatus, isTradeExecutionInFlight } = spotTileData

    return (
      <SpotTile currencyPair={currencyPair} spotTileData={spotTileData} executeTrade={executeTrade}>
        <TileControls tornOff={tornOff} onPopoutClick={onPopoutClick} />
        <TileBooking show={isTradeExecutionInFlight} />
        <NotificationContainer
          lastTradeExecutionStatus={lastTradeExecutionStatus}
          currencyPair={currencyPair}
          onNotificationDismissedClick={onNotificationDismissedClick}
        />
      </SpotTile>
    )
  }
}
