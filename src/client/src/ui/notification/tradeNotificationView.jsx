import React from 'react';
import './notification.scss';
import classnames from 'classnames';

const DONE = 'Done';
const REJECTED = 'REJECTED';
const BOUGHT = 'Bought';
const SOLD = 'Sold';

export default class TradeNotificationView extends React.Component {

  static propTypes ={
    message: React.PropTypes.object.isRequired,
    dismissNotification: React.PropTypes.func.isRequired
  };
  
  render() {
    let trade = this.props.message;
    let statusClassName = classnames(
      {
        'notification__status--done': trade.tradeStatus === DONE,
        'notification__status--rejected' : trade.tradeStatus !== DONE
      }
    );
    let tradeDescriptionClassName = classnames(
      {
        'notification__description-rejected': trade.tradeStatus === REJECTED
      }
    );
    let secondCurrency = trade.dealtCurrency === trade.baseCurrency ? trade.termsCurrency : trade.baseCurrency;
    let tradeStatus = trade.tradeStatus === 'Done' ? trade.tradeStatus : REJECTED;
    let direction = trade.direction === 'Buy' ? BOUGHT : SOLD;

    return (
      <div className='notification__container'>
        <div className='notification__title'>
          <span>{trade.baseCurrency} / {trade.termsCurrency}</span>
          <span className={statusClassName}>{tradeStatus}</span>
        </div>
        <div className={tradeDescriptionClassName}>
          <span className='notification__row-secondary'>{direction} </span>
          <span className='notification__row-primary'>{trade.dealtCurrency} </span>
          <span className='notification__row-primary'>{trade.notional}</span>
          <span className='notification__row-secondary'> vs </span>
          <span className='notification__row-primary'>{secondCurrency}</span>
          <span className='notification__row-secondary'> at </span>
          <span className='notification__row-primary'>{trade.spotRate}</span>
        </div>
        <div>
          <span className='notification__row-secondary'>Spot </span>
          <span className='notification__row-primary'>{trade.valueDate}</span>
        </div>
        <div>
          <span className='notification__row-secondary'>Trade ID </span>
          <span className='notification__row-primary'>{trade.tradeId}</span>
          <span className='notification__action-dismiss' onClick={() => this.props.dismissNotification()}>Done</span>
        </div>
      </div>
    );
  }
}
