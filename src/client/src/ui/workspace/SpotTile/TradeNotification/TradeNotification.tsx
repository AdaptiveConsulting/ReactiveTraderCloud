import React from 'react';
import classnames from 'classnames';
import './trade-notification.scss';


interface TradeNotificationProps {
  className: string
  tradeExecutionNotification: {},
  onDismissedClicked: () => void
}

type TradeStatus = {
  rejected: string,
  done: string,
  pending: string
}

const tradeStatus: TradeStatus = {
  rejected: 'Rejected',
  done: 'Done',
  pending: 'Pending'
}

class TradeNotification extends React.Component<TradeNotificationProps, {}>{
  props: TradeNotificationProps

  renderError() {
    const classNames = classnames(
      'trade-notification',
      'trade-notification--error',
      this.props.className
    );
    return (<div className={classNames}>
      {this.props.tradeExecutionNotification.hasError}. The execution status is unknown. Please contact your sales rep.
        <a href='#' className='trade-notification__button--dismiss' onClick={this.props.onDismissedClicked}>Done</a>
    </div>);
  }

  render() {
    const { tradeExecutionNotification, onDismissedClicked, className } = this.props;

    if (tradeExecutionNotification.hasError) {
      return this.renderError()
    }

    const classNames = classnames(
      'trade-notification',
      className,
      { 'trade-notification--rejected': tradeExecutionNotification.status === tradeStatus.rejected }
    )
    return (
      <div className={classNames}>
        <span className="trade-notification__trade-status">{tradeExecutionNotification.status.name}</span>
        <ul className="trade-notification__summary-items">
          <li className="trade-notification__summary-item trade-notification__summary-item--direction">
            {tradeExecutionNotification.direction}
          </li>
          <li className="trade-notification__summary-item trade-notification__summary-item--notional">
            {tradeExecutionNotification.dealtCurrency} {tradeExecutionNotification.notional}
          </li>
          <li className="trade-notification__summary-item trade-notification__summary-item--currency">
            <span className="trade-notification__label--versus">vs </span>{tradeExecutionNotification.termsCurrency}
          </li>
        </ul>
        <div className="trade-notification__details-items-container">
          <ul className="trade-notification__details-items trade-notification__details-items--rate">
            <li className="trade-notification__details-item trade-notification__details-item--label">
              Rate
            </li>
            <li className="trade-notification__details-item trade-notification__details-item--value">
              {tradeExecutionNotification.spotRate}
            </li>
          </ul>
          <ul className="trade-notification__details-items trade-notification__details-items--date">
            <li className="trade-notification__details-item trade-notification__details-item--label">
              Date
            </li>
            <li className="trade-notification__details-item trade-notification__details-item--value">
              {tradeExecutionNotification.formattedValueDate}
            </li>
          </ul>
          <ul className="trade-notification__details-items trade-notification__details-items--trade-id">
            <li className="trade-notification__details-item trade-notification__details-item--label">
              Trade ID
            </li>
            <li className="trade-notification__details-item trade-notification__details-item--value">
              {tradeExecutionNotification.tradeId}
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
