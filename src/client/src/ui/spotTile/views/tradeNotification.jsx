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
          'trade-notification--rejected': tradeExecutionNotification.status === TradeStatus.Rejected
        }
      );
      return (
        <div className={classNames}>
          <span className='trade-notification__trade-status'>{tradeExecutionNotification.status.name}</span>
          <span className='trade-notification__label'>{tradeExecutionNotification.direction} </span><br />
          <span className='trade-notification__value trade-notification__value--notional'>{tradeExecutionNotification.dealtCurrency} {tradeExecutionNotification.notional}</span><br/>
          <span className='trade-notification__label trade-notification__label--versus'> vs </span><span className='trade-notification__value trade-notification__value--currency'>{tradeExecutionNotification.termsCurrency}</span>


          <div className='trade-notification__details-items'>
            <div className='trade-notification__details-item trade-notification__details-item--rate'>
              <span className='trade-notification__label'>Rate</span><br />
              <span className='trade-notification__value'>{tradeExecutionNotification.spotRate}</span>
            </div>
            <div className='trade-notification__details-item trade-notification__details-item--date'>
              <span className='trade-notification__label'>Date</span><br />
              <span className='trade-notification__value'>{tradeExecutionNotification.formattedValueDate}</span>
            </div>
            <div className='trade-notification__details-item trade-notification__details-item--trade-id'>
              <span className='trade-notification__label'>Trade ID </span><br />
              <span className='trade-notification__value'>{tradeExecutionNotification.tradeId}</span>
            </div>
          </div>
          <a href='#' className='trade-notification__button--dismiss' onClick={onDismissedClicked}><i className='trade-notification__button--dismiss-icon fa fa-share' ></i></a>
        </div>
      );
    }
  }
}
