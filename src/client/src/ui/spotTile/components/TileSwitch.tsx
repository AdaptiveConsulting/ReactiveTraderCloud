import React, { Component } from 'react'
import { CurrencyPair, ServiceConnectionStatus } from 'rt-types'
import { ExecuteTradeRequest, SpotTileData } from '../model'
import { PriceMovementTypes } from '../model/priceMovementTypes'
import { TileBooking } from './notifications'
import NotificationContainer from './notifications'
import SpotTile from './SpotTile'
import TileControls from './TileControls'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  tornOff?: boolean
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
  onPopoutClick?: () => void
  onNotificationDismissed: () => void
  displayCurrencyChart?: () => void
}

export default class TileSwitch extends Component<Props> {
  static defaultProps: Partial<Props> = {
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
        priceStale: false
      },
      currencyChartIsOpening: false,
      lastTradeExecutionStatus: null
    },
    currencyPair: {
      symbol: '',
      ratePrecision: 0,
      pipsPosition: 0,
      base: '',
      terms: ''
    }
  }

  render() {
    const {
      currencyPair,
      spotTileData,
      executeTrade,
      tornOff,
      onPopoutClick,
      onNotificationDismissed,
      displayCurrencyChart,
      executionStatus
    } = this.props

    const { lastTradeExecutionStatus, isTradeExecutionInFlight } = spotTileData
    const isPriceStale = !lastTradeExecutionStatus && spotTileData.price && spotTileData.price.priceStale

    return (
      <SpotTile
        currencyPair={currencyPair}
        spotTileData={spotTileData}
        executeTrade={executeTrade}
        executionStatus={executionStatus}
      >
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
