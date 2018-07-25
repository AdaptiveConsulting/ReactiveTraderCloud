import classnames from 'classnames'
import numeral from 'numeral'
import React from 'react'
import { CurrencyPair, Notification, TradeStatus } from 'rt-types'
import { spotDateFormatter } from '../../model/dateUtils'

interface TradeNotificationProps {
  currencyPair: CurrencyPair
  notification: Notification
  onDismissedClicked: () => void
}

class TradeNotification extends React.Component<TradeNotificationProps, {}> {
  props: TradeNotificationProps

  renderError() {
    return (
      <div className="trade-notification">
        The execution status is unknown. Please contact your sales rep.
        <div className="trade-notification__button-dismiss" onClick={this.props.onDismissedClicked}>
          Done
        </div>
      </div>
    )
  }

  render() {
    const { notification, onDismissedClicked } = this.props

    if (notification.hasError) {
      return this.renderError()
    }

    const trade = notification.trade
    const formattedValueDate = trade ? spotDateFormatter(trade.valueDate) : ''

    const containerClassName = classnames('trade-notification', {
      'trade-notification--rejected': trade.status === TradeStatus.Rejected
    })

    const formattedNotional = numeral(trade.notional).format('0,000,000[.]00')
    return (
      <div className={containerClassName}>
        <span className="trade-notification__trade-status">{trade.status}</span>
        <div className="trade-notification__summary-item trade-notification__summary-item--direction">
          {trade.direction}
        </div>
        <div className="trade-notification__summary-item trade-notification__summary-item--notional">
          {trade.dealtCurrency} {formattedNotional}
        </div>
        <div className="trade-notification__summary-item trade-notification__summary-item--currency">
          <span className="trade-notification__label--versus">vs </span>
          {this.props.currencyPair.terms}
        </div>
        <div className="trade-notification__details-items-container">
          {this.createItemDetailElement('Rate', trade.spotRate)}
          {this.createItemDetailElement('Date', formattedValueDate)}
          {this.createItemDetailElement('Trade ID', trade.tradeId)}
        </div>
        <i className="trade-notification__dismiss-icon fa fa-share" onClick={onDismissedClicked} />
      </div>
    )
  }

  private createItemDetailElement = (label: string, value: string | number) => {
    return (
      <div className="trade-notification__details-item">
        <div className="trade-notification__details-item--label">{label}</div>
        <div className="trade-notification__details-item--value">{value}</div>
      </div>
    )
  }
}

export default TradeNotification
