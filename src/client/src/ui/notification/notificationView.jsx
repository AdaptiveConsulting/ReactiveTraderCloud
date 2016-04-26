import React from 'react';
import { TradeNotification } from '../../services/model';
import './notification.scss';
import { REJECTED, DONE} from '../../services/model/tradeNotification';

export default class NotificationView extends React.Component {

  state = {
    message: ''
  };

  componentDidMount(){
    window.onNotificationMessage = (message) => this.handleMessage(message);
  }

  handleMessage(message){
    this.setState({
      message: message
    });
  }

  dismissNotification(){
    window.fin.desktop.Notification.getCurrent().close();
  }

  render() {
    let trade:TradeNotification = this.state.message;
    let statusClassName = trade.tradeStatus == DONE ? 'notification__status-done' : 'notification__status-rejected';
    let tradeDescriptionClassName = trade.tradeStatus === REJECTED ? 'notification__description-rejected' : '';
    let secondCurrency = trade.dealtCurrency === trade.baseCurrency ? trade.termsCurrency : trade.baseCurrency;
    return (
      <div className='notification__container'>
        <div className='notification__title'>
          <span>{trade.baseCurrency} / {trade.termsCurrency}</span>
          <span className={statusClassName}>{trade.tradeStatus}</span>
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
