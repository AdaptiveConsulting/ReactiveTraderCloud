import * as React from 'react'
import * as classnames from 'classnames'
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
    <div >
      {this.props.notification.hasError}
      The execution status is unknown. Please contact your sales rep.
        <div
          className="trade-notification__button--dismiss"
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

    const containerClassName = classnames(
      { 'trade-notification--rejected': notification.status === TradeStatus.Rejected },
    )
    return (
      <div className={containerClassName}>
        <span className="trade-notification__trade-status">
          {notification.status}
          </span>
        <ul className="trade-notification__summary-items">
          <li
            // tslint:disable-next-line:max-line-length
            className="trade-notification__summary-item trade-notification__summary-item--direction">
            {notification.direction}
          </li>
          <li
            className="trade-notification__summary-item trade-notification__summary-item--notional">
            {notification.dealtCurrency} {notification.notional}
          </li>
          <li
            className="trade-notification__summary-item trade-notification__summary-item--currency">
            <span
              className="trade-notification__label--versus">vs </span>
              { this.props.currencyPair.terms }
          </li>
        </ul>
        <div className="trade-notification__details-items-container">
          { this.createNotificationPropertyDisplay('Rate', notification.spotRate)}
          { this.createNotificationPropertyDisplay('Date', notification.formattedValueDate)}
          { this.createNotificationPropertyDisplay('Trade ID', notification.tradeId)}
        </div>
        <div className="trade-notification__button--dismiss trade-notification__button--dismiss-icon"
          onClick={onDismissedClicked}>
          <i className="fa fa-share" ></i>
        </div>
      </div>
    )
  }

  private createNotificationPropertyDisplay = (label: string, value: string|number) => {
    return (
      <ul className="trade-notification__details-items trade-notification__details-items--date">
        <li
          className="trade-notification__details-item trade-notification__details-item--label">
          {label}
        </li>
        <li
          className="trade-notification__details-item trade-notification__details-item--value">
          {value}
        </li>
      </ul>
    )
  }
}

export default TradeNotification
