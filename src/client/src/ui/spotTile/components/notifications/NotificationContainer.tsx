import React, { Component } from 'react'
import { animated, Transition } from 'react-spring'
import { CurrencyPair, TradeStatus } from 'rt-types'
import { LastTradeExecutionStatus } from '../../model/spotTileData'
import TileExecuted from './TileExecuted'
import TileNotification from './TileNotification'

const defaultStyles: React.CSSProperties = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  bottom: '0px',
  zIndex: 2,
  overflowY: 'hidden'
}

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
    const { lastTradeExecutionStatus } = this.props
    return (
      <Transition
        from={{ maxHeight: 0 }}
        enter={{ maxHeight: 'auto' }}
        leave={{ maxHeight: 0 }}
        config={{ duration: 1000 }}
      >
        {hasNotification(lastTradeExecutionStatus) &&
          (styles => <animated.div style={{ ...defaultStyles, ...styles }}>{this.renderNotifications()}</animated.div>)}
      </Transition>
    )
  }

  private renderNotifications = () => {
    const { lastTradeExecutionStatus, currencyPair, onNotificationDismissedClick } = this.props
    if (!hasNotification(lastTradeExecutionStatus)) {
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
        )
      }
      if (lastTradeExecutionStatus.trade.status === TradeStatus.Rejected) {
        return (
          <TileNotification
            colors={{ bg: 'accentBad', color: 'white' }}
            icon="warning"
            symbols={`${dealtCurrency}/${terms}`}
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
