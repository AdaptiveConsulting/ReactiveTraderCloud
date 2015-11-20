import React from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import moment from 'moment';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  today = new Date();

const trades = [{
  id: _.uniqueId(),
  dateTime: today.toUTCString(),
  direction: 'buy',
  pair: 'EURGBP',
  amount: 100000,
  rate: 1.44,
  status: 'Done',
  valueDate: ['SP.', today.getDate(), MONTHS[today.getMonth()]].join(' '),
  trader: 'JDP'
}];

for (let i = 10; i; i--){
  trades.push(Object.assign({}, trades[0], {id: _.uniqueId(), direction: _.sample(['buy', 'sell'])}));
}

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
      trades: []
    }
  }

  componentWillMount(){
    this.setState({
      trades
    });
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
        {this.state.trades.map((trade) => {
          const notional = numeral(trade.amount).format('0,000,000.00') + ' ' + trade.pair.substr(0, 3),
            dateTime = moment(trade.dateTime).format('MMM Do, h:mm:ss a');


          return (
            <tr key={trade.id}>
              <td>{trade.id}</td>
              <td className='large'>{dateTime}</td>
              <td>{trade.direction}</td>
              <td>{trade.pair}</td>
              <td className='large text-right'>{notional}</td>
              <td className='text-right'>{trade.rate}</td>
              <td>{trade.status}</td>
              <td>{trade.valueDate}</td>
              <td className='large'>{trade.trader}</td>
            </tr>
          );
        })}
        </tbody>
      </table>

    </div>
  }
}

export default CurrencyPairs;
