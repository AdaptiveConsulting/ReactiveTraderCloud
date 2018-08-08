import React, { Component } from 'react'
import { CurrencyPair, TradeStatus } from 'rt-types'
import { LastTradeExecutionStatus } from '../../model/spotTileData'
import TileExecuted from './TileExecuted'
import TileNotification from './TileNotification'
import TileRejected from './TileRejected'

interface Props {
  lastTradeExecutionStatus: LastTradeExecutionStatus
  currencyPair: CurrencyPair
  onNotificationDismissedClick: () => void
}

export default class NotificationContainer extends Component<Props> {
  render() {
    return this.renderNotifications()
  }

  private renderNotifications = () => {
    const { lastTradeExecutionStatus, currencyPair, onNotificationDismissedClick } = this.props
    if (!lastTradeExecutionStatus) {
      return null
    }
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

    return null
  }
}
