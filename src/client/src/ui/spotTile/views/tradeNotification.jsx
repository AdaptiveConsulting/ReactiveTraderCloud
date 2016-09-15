import React from 'react';
import { TradeExecutionNotification } from '../model';
import { TradeStatus } from '../../../services/model';
import classnames from 'classnames';
import './tradeNotification.scss';

export default class TradeNotification extends React.Component {

  static propTypes = {
    className: React.PropTypes.string,
    tradeExecutionNotification: React.PropTypes.object.isRequired,
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
          <ul className='trade-notification__summary-items'>
            <li className='trade-notification__summary-item trade-notification__summary-item--direction'>{tradeExecutionNotification.direction} </li>
            <li className='trade-notification__summary-item trade-notification__summary-item--notional'>{tradeExecutionNotification.dealtCurrency} {tradeExecutionNotification.notional}</li>
            <li className='trade-notification__summary-item trade-notification__summary-item--currency'><span className='trade-notification__label--versus'>vs </span>{tradeExecutionNotification.termsCurrency}</li>
          </ul>
          <div className='trade-notification__details-items-container'>
            <ul className='trade-notification__details-items trade-notification__details-items--rate'>
              <li className='trade-notification__details-item trade-notification__details-item--label'>Rate</li>
              <li className='trade-notification__details-item trade-notification__details-item--value'>{tradeExecutionNotification.spotRate}</li>
            </ul>
            <ul className='trade-notification__details-items trade-notification__details-items--date'>
              <li className='trade-notification__details-item trade-notification__details-item--label'>Date</li>
              <li className='trade-notification__details-item trade-notification__details-item--value'>{tradeExecutionNotification.formattedValueDate}</li>
            </ul>
            <ul className='trade-notification__details-items trade-notification__details-items--trade-id'>
              <li className='trade-notification__details-item trade-notification__details-item--label'>Trade ID </li>
              <li className='trade-notification__details-item trade-notification__details-item--value'>{tradeExecutionNotification.tradeId}</li>
            </ul>
          </div>
          <a href='#' className='trade-notification__button--dismiss' onClick={onDismissedClicked}><i className='trade-notification__button--dismiss-icon fa fa-share' ></i></a>
        </div>
      );
    }
  }
}
