import * as React from 'react'
import * as classnames from 'classnames'
import './trade-notification.scss'
import { TradeStatus } from '../../../types'

interface TradeNotificationProps {
  className: string,
  notification: {
    hasError: boolean
    status: TradeStatus
    dealtCurrency: string
    notional: number
    termsCurrency: any
    direction: string
    spotRate: number
    formattedValueDate: string
    tradeId: string,
  },
  onDismissedClicked: () => void
}

class TradeNotification extends React.Component<TradeNotificationProps, {}>{
  props: TradeNotificationProps

  renderError() {
    const classNames = classnames(
      'trade-notification',
      'trade-notification--error',
      this.props.className,
    )
    return (
    <div className={classNames}>
      {this.props.notification.hasError}.
      The execution status is unknown. Please contact your sales rep.
        <a
          href="#"
          className="trade-notification__button--dismiss"
          onClick={this.props.onDismissedClicked}>
          Done
        </a>
    </div>)
  }

  render() {
    const { notification, onDismissedClicked, className } = this.props

    if (notification.hasError) {
      return this.renderError()
    }

    const classNames = classnames(
      'trade-notification',
      className,
      { 'trade-notification--rejected': notification.status === TradeStatus.Rejected },
    )
    return (
      <div className={classNames}>
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
              {notification.termsCurrency}
          </li>
        </ul>
        <div className="trade-notification__details-items-container">
          <ul className="trade-notification__details-items trade-notification__details-items--rate">
            <li
              className="trade-notification__details-item trade-notification__details-item--label">
              Rate
            </li>
            <li
              className="trade-notification__details-item trade-notification__details-item--value">
              {notification.spotRate}
            </li>
          </ul>
          <ul className="trade-notification__details-items trade-notification__details-items--date">
            <li
              className="trade-notification__details-item trade-notification__details-item--label">
              Date
            </li>
            <li
              className="trade-notification__details-item trade-notification__details-item--value">
              {notification.formattedValueDate}
            </li>
          </ul>
          <ul
             // tslint:disable-next-line:max-line-length
            className="trade-notification__details-items trade-notification__details-items--trade-id">
            <li className="trade-notification__details-item trade-notification__details-item--label">
              Trade ID
            </li>
            <li
              className="trade-notification__details-item trade-notification__details-item--value">
              {notification.tradeId}
            </li>
          </ul>
        </div>
        <a
          href="#"
          className="trade-notification__button--dismiss"
          onClick={onDismissedClicked}>
          <i className="trade-notification__button--dismiss-icon fa fa-share" ></i>
        </a>
      </div>
    )
  }
}

export default TradeNotification
