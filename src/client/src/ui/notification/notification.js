import React from 'react';
import { TradeNotification } from '../../services/model';

export default class Message extends React.Component {

  static propTypes ={
    message: React.PropTypes.object.isRequired
  };

  dismissNotification(){
      window.fin.desktop.Notification.getCurrent().close();
  }

  render(){
    let trade:TradeNotification = this.props.message;
    let statusClassName = trade.tradeStatus == 'Done' ? 'notification__status-done' : 'notification__status-rejected';
    let tradeDescriptionClassName = trade.tradeStatus === 'REJECTED' ? 'notification__description-rejected' : '';
    let secondCurrency = trade.dealtCurrency === trade.baseCurrency ? trade.termsCurrency : trade.baseCurrency;
    return (
      <div>
        <div className='notification__title'>
          <span>{this.props.message.baseCurrency} / {this.props.message.termsCurrency}</span>
          <span className={statusClassName}>{this.props.message.tradeStatus}</span>
        </div>
        <div className={tradeDescriptionClassName}>
          <span className='notification__row-secondary'>{trade.direction} </span>
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
          <span className='notification__action-dismiss' onClick={() => this.dismissNotification()}>Done</span>
        </div>
      </div>
    );
  }
}


