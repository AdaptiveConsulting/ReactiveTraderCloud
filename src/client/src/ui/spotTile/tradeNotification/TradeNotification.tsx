import * as React from 'react'
import * as classnames from 'classnames'
import { timeFormat } from 'd3-time-format'
import './TradeNotificationStyles.scss'
import { CurrencyPair, TradeStatus } from '../../../types'
import { Notification } from '../../../types/notification'

interface TradeNotificationProps {
  currencyPair: CurrencyPair
  notification: Notification,
  onDismissedClicked: () => void
}

class TradeNotification extends React.Component<TradeNotificationProps, {}>{
  props: TradeNotificationProps

  renderError() {
    return (
    <div className="trade-notification">
      The execution status is unknown. Please contact your sales rep.
        <div className="trade-notification__button-dismiss"
          onClick={this.props.onDismissedClicked}>
          Done
        </div>
    </div>)
  }

  render() {
    const { notification, onDismissedClicked } = this.props

    if (notification.hasError) {
      return this.renderError()
    }

    const trade = notification.trade
    const formattedValueDate = `SP. ${timeFormat('%b %e')(trade.valueDate)}`

    const containerClassName = classnames(
      'trade-notification',
      { 'trade-notification--rejected': trade.status === TradeStatus.Rejected }
    )
    return (
      <div className={containerClassName}>
        <span className="trade-notification__trade-status">
          {trade.status}
        </span>
        <div className="trade-notification__summary-item--direction">
          {trade.direction}
        </div>
        <div className="trade-notification__summary-item--notional">
          {trade.dealtCurrency} {trade.notional}
        </div>
        <div className="trade-notification__summary-item--currency">
          <span className="trade-notification__label--versus">vs </span>
          { this.props.currencyPair.terms }
        </div>
        <div className="trade-notification__details-items-container">
          { this.createItemDetailElement('Rate', trade.spotRate)}
          { this.createItemDetailElement('Date', formattedValueDate)}
          { this.createItemDetailElement('Trade ID', trade.tradeId)}
        </div>
        <i className="trade-notification__dismiss-icon fa fa-share"
           onClick={onDismissedClicked}/>
      </div>
    )
  }

  private createItemDetailElement = (label: string, value: string|number) => {
    return (
      <div className="trade-notification__details-item">
        <div className="trade-notification__details-item--label">
          {label}
        </div>
        <div className="trade-notification__details-item--value">
          {value}
        </div>
      </div>
    )
  }
}

export default TradeNotification
