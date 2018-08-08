import React, { Component } from 'react'
import { CurrencyPair, Direction, TradeStatus } from 'rt-types'
import { SpotTileData } from '../model/spotTileData'
import { TileBooking, TileExecuted, TileNotification, TileRejected } from './notifications'
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
    const { currencyPair, spotTileData, executeTrade, tornOff, onPopoutClick } = this.props

    if (!spotTileData || !spotTileData.price || !currencyPair) {
      return null
    }

    const { lastTradeExecutionStatus, isTradeExecutionInFlight } = spotTileData

    return (
      <SpotTile currencyPair={currencyPair} spotTileData={spotTileData} executeTrade={executeTrade}>
        <TileControls tornOff={tornOff} onPopoutClick={onPopoutClick} />
        <TileBooking show={isTradeExecutionInFlight} />

        {lastTradeExecutionStatus && this.renderNotifications()}
      </SpotTile>
    )
  }

  private renderNotifications = () => {
    const {
      spotTileData: { lastTradeExecutionStatus },
      currencyPair,
      onNotificationDismissedClick
    } = this.props
    if (lastTradeExecutionStatus.hasError) {
      return (
        <TileNotification
          symbols={`${currencyPair.base}/${currencyPair.terms}`}
          icon="warning"
          colors={{ bg: 'accentBad', color: 'white' }}
        >
          {lastTradeExecutionStatus.error}
        </TileNotification>
      )
    }

    if (lastTradeExecutionStatus.trade) {
      const { dealtCurrency, tradeId } = lastTradeExecutionStatus.trade
      const { terms } = currencyPair
      if (lastTradeExecutionStatus.trade.status === TradeStatus.Done) {
        const { direction, notional, spotRate, tradeDate } = lastTradeExecutionStatus.trade

        return (
          <TileExecuted
            onNotificationDismissedClick={onNotificationDismissedClick}
            direction={direction}
            dealtCurrency={dealtCurrency}
            counterCurrency={terms}
            notional={notional}
            tradeId={tradeId}
            rate={spotRate}
            date={tradeDate}
          />
        )
      }
      if (lastTradeExecutionStatus.trade.status === TradeStatus.Rejected) {
        return (
          <TileRejected
            onNotificationDismissedClick={onNotificationDismissedClick}
            dealtCurrency={dealtCurrency}
            counterCurrency={terms}
            tradeId={tradeId}
          />
        )
      }
    }
  }
}
