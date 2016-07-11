import React from 'react';
import './notification.scss';
import classnames from 'classnames';
import Direction from '../../services/model/direction';
import TradeStatus from '../../services/model/tradeStatus';
import '../common/styles/_base.scss';
import '../common/styles/_fonts.scss';
const DONE = 'Done';
const REJECTED = 'Rejected';
const BOUGHT = 'Bought';
const SOLD = 'Sold';

export default class TradeNotificationView extends React.Component {

  static propTypes ={
    message: React.PropTypes.object.isRequired,
    dismissNotification: React.PropTypes.func.isRequired
  };

  render() {
    let trade = this.props.message;
    let statusClassName = classnames('notification__status',
      {
        'notification__status--done': trade.tradeStatus === DONE,
        'notification__status--rejected' : trade.tradeStatus !== DONE
      }
    );
    let tradeSummaryClasses = classnames('notification__summary-items',
      {
        'notification__summary-items--rejected': trade.tradeStatus === REJECTED
      }
    );
    let tradeStatus = trade.tradeStatus === TradeStatus.Done ? trade.tradeStatus : REJECTED.toUpperCase();
    let direction = trade.direction == Direction.Buy.name ? BOUGHT : SOLD;

    return (
      <div className='notification'>
        <div className='notification__content'>
          <span className={statusClassName}>{tradeStatus}</span>
          <ul className={tradeSummaryClasses}>
            <li className='notification__summary-item notification__summary-item--direction'>{direction}</li>
            <li className='notification__summary-item notification__summary-item--notional'>{trade.baseCurrency} {trade.notional}</li>
            <li className='notification__summary-item notification__summary-item--currency'>vs {trade.termsCurrency}</li>
          </ul>
          <div className='notification__details-items-container'>
            <ul className='notification__details-items'>
              <li className='notification__details-item notification__details-item--label'>Rate</li>
              <li className='notification__details-item notification__details-item--value'>{trade.spotRate}</li>
            </ul>
            <ul className='notification__details-items'>
              <li className='notification__details-item notification__details-item--label'>Date</li>
              <li className='notification__details-item notification__details-item--value'>{trade.valueDate}</li>
            </ul>
            <ul className='notification__details-items'>
              <li className='notification__details-item notification__details-item--label'>Trade Id</li>
              <li className='notification__details-item notification__details-item--value'>{trade.tradeId}</li>
            </ul>
          </div>
          <a href='#' className='notification__button--dismiss' onClick={() => this.props.dismissNotification()}><i className='notification__button--dismiss-icon fa fa-share' ></i></a>
        </div>
      </div>
    );
  }
}
