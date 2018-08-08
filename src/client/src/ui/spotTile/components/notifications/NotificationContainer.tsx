import React, { Component } from 'react'
import { Transition } from 'react-spring'
import { CurrencyPair, TradeStatus } from 'rt-types'
import { styled } from 'rt-util'
import { LastTradeExecutionStatus } from '../../model/spotTileData'
import TileExecuted from './TileExecuted'
import TileNotification from './TileNotification'

const NotificationWrapper = styled('div')`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 2;
`

interface Props {
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
    const { lastTradeExecutionStatus, currencyPair, onNotificationDismissedClick } = this.props
    if (!hasNotification(lastTradeExecutionStatus)) {
      return () => null
    }
    if (lastTradeExecutionStatus.hasError) {
      return style => (
        <NotificationWrapper style={style}>
          <TileNotification
            symbols={`${currencyPair.base}/${currencyPair.terms}`}
            icon="warning"
            colors={{ bg: 'accentBad', color: 'white' }}
          >
            {lastTradeExecutionStatus.error}
          </TileNotification>
        </NotificationWrapper>
      )
    }

    if (lastTradeExecutionStatus.trade) {
      const { dealtCurrency, tradeId } = lastTradeExecutionStatus.trade
      const { terms } = currencyPair
      if (lastTradeExecutionStatus.trade.status === TradeStatus.Done) {
        const { direction, notional, spotRate, tradeDate } = lastTradeExecutionStatus.trade

        return style => (
          <NotificationWrapper style={style}>
            <TileNotification
              colors={{ bg: 'accentGood', color: 'white' }}
              icon="check"
              symbols={`${dealtCurrency}/${terms}`}
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
          </NotificationWrapper>
        )
      }
      if (lastTradeExecutionStatus.trade.status === TradeStatus.Rejected) {
        return style => (
          <NotificationWrapper style={style}>
            <TileNotification
              colors={{ bg: 'accentBad', color: 'white' }}
              icon="warning"
              symbols={`${dealtCurrency}/${terms}`}
              tradeId={tradeId}
              handleClick={onNotificationDismissedClick}
            >
              Your trade has been rejected
            </TileNotification>
          </NotificationWrapper>
        )
      }
    }
  }
}
