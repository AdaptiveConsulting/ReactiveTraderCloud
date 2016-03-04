import React from 'react';
import numeral from 'numeral';
import { time } from 'd3';
import { Trade, Direction } from '../../../services/model';
import { TradeExecutionNotification } from '../model';

export default class TradeNotification extends React.Component {

  static propTypes = {
    tradeExecutionNotification: React.PropTypes.instanceOf(TradeExecutionNotification).isRequired,
    onDismissedClicked: React.PropTypes.func
  };

  render(){
    if(this.props.tradeExecutionNotification.hasError) {
      return (<div className='blocked summary-state animated flipInX'>
        <span className='key'>Error:</span> ${this.props.tradeExecutionNotification.error}. The execution status is unknown. Please contact your sales rep.
        <a href='#' className='pull-right dismiss-message' onClick={this.props.onDismissedClicked}>Done</a>
      </div>);
    } else {
      let trade = this.props.tradeExecutionNotification.trade;
      let action = trade.direction === Direction.Sell ? 'Sold' : 'Bought';
      let notional = numeral(trade.notional).format('0,000,000[.]00');
      return (
        <div className={trade.status + ' summary-state animated flipInX'}>
          <span className='key'>{action}</span> {trade.currencyPair.base} {notional}<br/>
          <span className='key'>vs</span> {trade.currencyPair.terms}
          <span className='key'>at</span> {trade.spotRate}<br/>
          <span className='key'>{trade.formattedValueDate}</span><br/>
          <span className='key'>Trade ID</span> {trade.tradeId}
          <a href='#' className='pull-right dismiss-message' onClick={this.props.onDismissedClicked}>{trade.status.name}</a>
        </div>
      );
    }
  }
}
