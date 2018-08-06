import React, { Component } from 'react'
import { CurrencyPair, Direction, NotificationType, TradeStatus } from 'rt-types'
import { SpotTileData } from '../model/spotTileData'
import { TileBooking, TileExecuted, TileNotification, TileRejected } from './notifications'
import SpotTile from './SpotTile'
import TileControls from './TileControls'

interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  tornOff: boolean
  executeTrade: (direction: Direction) => void
  onPopoutClick?: () => void
  onNotificationDismissedClick: () => void
}

export default class TileSwitch extends Component<Props> {
  render() {
    const { currencyPair, spotTileData, executeTrade, tornOff, onPopoutClick } = this.props
    //TODO Don't render if services not up
    if (!spotTileData || !currencyPair || !spotTileData.price) {
      return null
    }
    return (
      <SpotTile currencyPair={currencyPair} spotTileData={spotTileData} executeTrade={executeTrade}>
        <TileControls tornOff={tornOff} onPopoutClick={onPopoutClick} />
        {this.renderStates()}
      </SpotTile>
    )
  }

  private renderStates = () => {
    const { spotTileData, currencyPair, onNotificationDismissedClick } = this.props
    if (spotTileData.isTradeExecutionInFlight) {
      return <TileBooking />
    }
    if (spotTileData.notification) {
      const { notification } = spotTileData
      if (notification.notificationType === NotificationType.Trade) {
        const { dealtCurrency, tradeId } = notification.trade
        const { terms } = currencyPair
        if (notification.trade.status === TradeStatus.Done) {
          const { direction, notional, spotRate, tradeDate } = notification.trade

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
        } else if (notification.trade.status === TradeStatus.Rejected) {
          return (
            <TileRejected
              onNotificationDismissedClick={onNotificationDismissedClick}
              dealtCurrency={dealtCurrency}
              counterCurrency={terms}
              tradeId={tradeId}
            />
          )
        }
      } else if (notification.notificationType === NotificationType.Text) {
        return (
          <TileNotification
            symbols={`${currencyPair.base}/${currencyPair.terms}`}
            icon="warning"
            colors={{ bg: 'accentBad', color: 'white' }}
          >
            {notification.message}
          </TileNotification>
        )
      } else {
        throw new Error(`Unknown notification type ${notification.notificationType}`)
      }
    }
    return null
  }
}
