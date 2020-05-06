import React, { PureComponent } from 'react'
import { Transition } from 'react-spring'
import { CurrencyPair, TradeStatus } from 'rt-types'
import { LastTradeExecutionStatus } from '../../model/spotTileData'
import TileExecuted from './TileExecuted'
import TileNotification, { NotificationType } from './TileNotification'

interface Props {
  lastTradeExecutionStatus?: LastTradeExecutionStatus | null
  currencyPair: CurrencyPair
  onNotificationDismissed: () => void
}

const hasNotification = (tradeStatus: LastTradeExecutionStatus) =>
  tradeStatus.hasWarning || tradeStatus.hasError || tradeStatus.trade

export default class NotificationContainer extends PureComponent<Props> {
  render() {
    return (
      <Transition
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0, pointerEvents: 'none' }}
      >
        {this.renderNotifications() as any}
      </Transition>
    )
  }

  private renderNotifications: () => (style: React.CSSProperties) => JSX.Element | null = () => {
    const { lastTradeExecutionStatus, currencyPair, onNotificationDismissed } = this.props
    const symbols = `${currencyPair.base}/${currencyPair.terms}`
    if (!lastTradeExecutionStatus || !hasNotification(lastTradeExecutionStatus)) {
      return () => null
    }

    if (lastTradeExecutionStatus.hasError || lastTradeExecutionStatus.hasWarning) {
      const isError = lastTradeExecutionStatus.hasError

      return (style: React.CSSProperties) => (
        <TileNotification
          style={style}
          symbols={symbols}
          type={isError ? NotificationType.Error : NotificationType.Warning}
        >
          {isError ? lastTradeExecutionStatus.error : lastTradeExecutionStatus.warning}
        </TileNotification>
      )
    }

    if (lastTradeExecutionStatus.trade) {
      const { dealtCurrency, tradeId } = lastTradeExecutionStatus.trade
      const { terms } = currencyPair
      if (lastTradeExecutionStatus.trade.status === TradeStatus.Done) {
        const { direction, notional, spotRate, valueDate } = lastTradeExecutionStatus.trade

        return (style: React.CSSProperties) => (
          <TileNotification
            style={style}
            symbols={symbols}
            tradeId={tradeId}
            handleClick={onNotificationDismissed}
            type={NotificationType.Success}
          >
            <TileExecuted
              direction={direction}
              dealtCurrency={dealtCurrency}
              counterCurrency={terms}
              notional={notional}
              rate={spotRate}
              date={valueDate}
            />
          </TileNotification>
        )
      }
      if (lastTradeExecutionStatus.trade.status === TradeStatus.Rejected) {
        return (style: React.CSSProperties) => (
          <TileNotification
            style={style}
            symbols={symbols}
            tradeId={tradeId}
            handleClick={onNotificationDismissed}
            type={NotificationType.Error}
          >
            Your trade has been rejected
          </TileNotification>
        )
      }
    }
    return () => null
  }
}
