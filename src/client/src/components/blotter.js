import React from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import moment from 'moment';

/**
 * @class CurrencyPairs
 * @extends {React.Component}
 */
class CurrencyPairs extends React.Component {

  /**
   * @constructs CurrencyPair
   * @param {Object=} props
   * @param {Object=} context
   */
  constructor(props, context){
    super(props, context);
    this.state = {
    };
  }

  renderRow(trade){
    const notional = numeral(trade.amount).format('0,000,000.00') + ' ' + trade.pair.substr(0, 3),
          dateTime = moment(trade.dateTime).format('MMM Do, h:mm:ss a');

    return (
      <tr key={trade.id} className={trade.status}>
        <td>{trade.id}</td>
        <td className='large'><div>{dateTime}</div></td>
        <td className={'direction ' + trade.direction}>{trade.direction}</td>
        <td>{trade.pair}</td>
        <td className='large text-right'>{notional}</td>
        <td className='text-right'>{trade.rate}</td>
        <td className='status'>{trade.status}</td>
        <td>{trade.valueDate}</td>
        <td className='large'>{trade.trader}</td>
      </tr>
    );
  }

  render(){
    return <div className='blotter'>
      <table className='table table-compact'>
        <thead>
        <tr>
          <th>Id</th>
          <th className='large'>Date</th>
          <th>Dir.</th>
          <th>CCY</th>
          <th className='large text-right'>Notional</th>
          <th className='text-right'>Rate</th>
          <th>Status</th>
          <th>Value date</th>
          <th className='large'>Trader</th>
        </tr>
        </thead>
        <tbody>
        {this.props.trades.map(this.renderRow)}
        </tbody>
      </table>

    </div>
  }
}

export default CurrencyPairs;
