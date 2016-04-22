import React from 'react';
import { TradeExecutionNotification } from '../model';
import { TradeStatus } from '../../../services/model';
import classnames from 'classnames';
import './tradeNotification.scss';

export default class TradeNotification extends React.Component {

  static propTypes = {
    className: React.PropTypes.string,
    tradeExecutionNotification: React.PropTypes.instanceOf(TradeExecutionNotification).isRequired,
    onDismissedClicked: React.PropTypes.func
  };

  render(){
    let { tradeExecutionNotification, onDismissedClicked, className } = this.props;

    if(tradeExecutionNotification.hasError) {
      let classNames = classnames(
        'trade-notification',
        'trade-notification--error',
        className
      );
      return (<div className={classNames}>
        {tradeExecutionNotification.error}. The execution status is unknown. Please contact your sales rep.
        <a href='#' className='trade-notification__button--dismiss' onClick={onDismissedClicked}>Done</a>
      </div>);
    } else {
      let classNames = classnames(
        'trade-notification',
        className,
        {
          'trade-notification--rejected': tradeExecutionNotification.status === TradeStatus.Rejected.name
        }
      );
      return (
        <div className={classNames}>
          <span className='trade-notification__trade-status'>{tradeExecutionNotification.status}</span>
          <span className='trade-notification__label'>{tradeExecutionNotification.direction} </span><span className='trade-notification__value'>{tradeExecutionNotification.dealtCurrency} {tradeExecutionNotification.notional}</span><br/>
          <span className='trade-notification__label'> vs </span><span className='trade-notification__value'>{tradeExecutionNotification.termsCurrency}</span>
          <span className='trade-notification__label'> at </span><span className='trade-notification__value'>{tradeExecutionNotification.spotRate}</span><br/>
          <span className='trade-notification__value'>{tradeExecutionNotification.formattedValueDate}</span><br/>
          <span className='trade-notification__label'>Trade ID </span><span className='trade-notification__value'>{tradeExecutionNotification.tradeId}</span>
          <a href='#' className='trade-notification__button--dismiss' onClick={onDismissedClicked}>Done</a>
        </div>
      );
    }
  }
}
