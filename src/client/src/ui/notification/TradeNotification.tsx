import * as React from 'react'
import * as classnames from 'classnames'
import { Direction, Trade, TradeStatus } from '../../types'
import '../common/styles/_base.scss'
import '../common/styles/_fonts.scss'
import './TradeNotificationStyles.scss'

export interface TradeNotificationProps {
  message: Trade
  dismissNotification: any
}

export default class TradeNotification extends React.Component<TradeNotificationProps, {}> {
  render() {
    const trade = this.props.message
    const formattedValueDate = trade ? trade.valueDate : ''

    const statusClassName = classnames(
      'notification__status',
      {
        'notification__status--done': trade.status === TradeStatus.Done,
        'notification__status--rejected' : trade.status !== TradeStatus.Done,
      },
    )
    const tradeSummaryClasses = classnames(
      'notification__summary-items',
      {
        'notification__summary-items--rejected': trade.status === TradeStatus.Rejected,
      },
    )
    const tradeStatus = trade.status === TradeStatus.Done ? trade.status : 'REJECTED'

    const direction = trade.direction === Direction.Buy ? 'Bought' : 'Sold'

    return (
      <div className="notification">
        <div className="notification__content">
          <span className={statusClassName}>{tradeStatus}</span>
          <ul className={tradeSummaryClasses}>
            <li className="notification__summary-item notification__summary-item--direction">{direction}</li>
            <li className="notification__summary-item notification__summary-item--notional">{trade.dealtCurrency} {trade.notional}</li>
            <li className="notification__summary-item notification__summary-item--currency">vs {trade.termsCurrency}</li>
          </ul>
          <div className="notification__details-items-container">
            <ul className="notification__details-items">
              <li className="notification__details-item notification__details-item--label">Rate</li>
              <li className="notification__details-item notification__details-item--value">{trade.spotRate}</li>
            </ul>
            <ul className="notification__details-items">
              <li className="notification__details-item notification__details-item--label">Date</li>
              <li className="notification__details-item notification__details-item--value">SP. {formattedValueDate}</li>
            </ul>
            <ul className="notification__details-items">
              <li className="notification__details-item notification__details-item--label">Trade Id</li>
              <li className="notification__details-item notification__details-item--value">{trade.tradeId}</li>
            </ul>
          </div>
          <a href="#" className="notification__button--dismiss" onClick={() => this.props.dismissNotification()}><i className="notification__button--dismiss-icon fa fa-share" ></i></a>
        </div>
      </div>
    )
  }
}
