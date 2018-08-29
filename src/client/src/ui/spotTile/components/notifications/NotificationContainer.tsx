import React, { PureComponent, SFC } from 'react'
import { Transition } from 'react-spring'
import { CurrencyPair, TradeStatus } from 'rt-types'
import { LastTradeExecutionStatus } from '../../model/spotTileData'
import TileExecuted from './TileExecuted'
import TileNotification from './TileNotification'

interface Props {
  isPriceStale?: boolean
  lastTradeExecutionStatus?: LastTradeExecutionStatus | null
  currencyPair: CurrencyPair
  onNotificationDismissed: () => void
}

const hasNotification = (tradeStatus: LastTradeExecutionStatus) => tradeStatus.hasError || tradeStatus.trade

export default class NotificationContainer extends PureComponent<Props> {
  render() {
    return (
      <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0, pointerEvents: 'none' }}>
        {this.renderNotifications()}
      </Transition>
    )
  }

  private renderNotifications = () => {
    const { lastTradeExecutionStatus, currencyPair, onNotificationDismissed, isPriceStale } = this.props
    const symbols = `${currencyPair.base}/${currencyPair.terms}`
    if (isPriceStale) {
      return (style: React.CSSProperties) => (
        <TileNotification style={style} symbols={symbols} isWarning={true}>
          Pricing is unavailable
        </TileNotification>
      )
    }
    if (!lastTradeExecutionStatus || !hasNotification(lastTradeExecutionStatus)) {
      return (() => null) as SFC<object>
    }
    if (lastTradeExecutionStatus.hasError) {
      return (style: React.CSSProperties) => (
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

        return (style: React.CSSProperties) => (
          <TileNotification
            style={style}
            isWarning={false}
            symbols={symbols}
            tradeId={tradeId}
            handleClick={onNotificationDismissed}
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
        return (style: React.CSSProperties) => (
          <TileNotification
            style={style}
            isWarning={true}
            symbols={symbols}
            tradeId={tradeId}
            handleClick={onNotificationDismissed}
          >
            Your trade has been rejected
          </TileNotification>
        )
      }
    }
    return (() => null) as SFC<object>
  }
}
