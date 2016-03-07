import React from 'react';
import { time } from 'd3';
import { Trade, Direction } from '../../../services/model';
import { TradeExecutionNotification } from '../model';

export default class TradeNotification extends React.Component {

  static propTypes = {
    tradeExecutionNotification: React.PropTypes.instanceOf(TradeExecutionNotification).isRequired,
    onDismissedClicked: React.PropTypes.func
  };

  render(){
    let { tradeExecutionNotification, onDismissedClicked } = this.props;

    if(tradeExecutionNotification.hasError) {
      return (<div className='blocked summary-state animated flipInX'>
        <span className='key'>Error:</span> {tradeExecutionNotification.error}. The execution status is unknown. Please contact your sales rep.
        <a href='#' className='pull-right dismiss-message' onClick={onDismissedClicked}>Done</a>
      </div>);
    } else {
      return (
        <div className={tradeExecutionNotification.status + ' summary-state animated flipInX'}>
          <span className='key'>{tradeExecutionNotification.direction}</span> {tradeExecutionNotification.dealtCurrency} {tradeExecutionNotification.notional}<br/>
          <span className='key'>vs</span> {tradeExecutionNotification.termsCurrency}
          <span className='key'>at </span> {tradeExecutionNotification.spotRate}<br/>
          <span className='key'>{tradeExecutionNotification.formattedValueDate}</span><br/>
          <span className='key'>Trade ID</span> {tradeExecutionNotification.tradeId}
          <a href='#' className='pull-right dismiss-message' onClick={onDismissedClicked}>{tradeExecutionNotification.status}</a>
        </div>
      );
    }
  }
}
