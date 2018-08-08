import React, { Component } from 'react'
import { Transition } from 'react-spring'
import { CurrencyPair, TradeStatus } from 'rt-types'
import { LastTradeExecutionStatus } from '../../model/spotTileData'
import TileExecuted from './TileExecuted'
import TileNotification from './TileNotification'

interface Props {
  isPriceStale: boolean
  lastTradeExecutionStatus: LastTradeExecutionStatus
  currencyPair: CurrencyPair
  onNotificationDismissedClick: () => void
}

const hasNotification = (tradeStatus: LastTradeExecutionStatus) => {
  if (tradeStatus && (tradeStatus.hasError || tradeStatus.trade)) {
    return true
  }
  return false
}

export default class NotificationContainer extends Component<Props> {
  render() {
    return (
      <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
        {this.renderNotifications()}
      </Transition>
    )
  }

  private renderNotifications = () => {
    const { lastTradeExecutionStatus, currencyPair, onNotificationDismissedClick, isPriceStale } = this.props
    const symbols = `${currencyPair.base}/${currencyPair.terms}`
    if (isPriceStale) {
      return style => (
        <TileNotification style={style} symbols={symbols} isWarning={true}>
          Pricing is unavailable
        </TileNotification>
      )
    }
    if (!hasNotification(lastTradeExecutionStatus)) {
      return () => null
    }
    if (lastTradeExecutionStatus.hasError) {
      return style => (
        <TileNotification style={style} symbols={symbols} isWarning={true}>
          {lastTradeExecutionStatus.error}
        </TileNotification>
      )
    }

    if (lastTradeExecutionStatus.trade) {
      const { dealtCurrency, tradeId } = lastTradeExecutionStatus.trade
      const { terms } = currencyPair
      if (lastTradeExecutionStatus.trade.status === TradeStatus.Done) {
        const { direction, notional, spotRate, tradeDate } = lastTradeExecutionStatus.trade

        return style => (
          <TileNotification
            style={style}
            isWarning={false}
            symbols={symbols}
            tradeId={tradeId}
            handleClick={onNotificationDismissedClick}
          >
            <TileExecuted
              direction={direction}
              dealtCurrency={dealtCurrency}
              counterCurrency={terms}
              notional={notional}
              rate={spotRate}
              date={tradeDate}
            />
          </TileNotification>
        )
      }
      if (lastTradeExecutionStatus.trade.status === TradeStatus.Rejected) {
        return style => (
          <TileNotification
            style={style}
            isWarning={true}
            symbols={symbols}
            tradeId={tradeId}
            handleClick={onNotificationDismissedClick}
          >
            Your trade has been rejected
          </TileNotification>
        )
      }
    }
  }
}
