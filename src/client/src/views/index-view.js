import React from 'react';
import CurrencyPairs from '../components/currency-pairs';
import Blotter from '../components/blotter';

import moment from 'moment';
import rt from '../classes/services/reactive-trader';

//todo: remove mocks
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today  = new Date();

const trades = [{
  id: _.uniqueId(),
  dateTime: today,
  direction: 'buy',
  pair: 'EURGBP',
  amount: 100000,
  rate: 1.44,
  status: 'Done',
  valueDate: ['SP.', today.getDate(), MONTHS[today.getMonth()]].join(' '),
  trader: 'JDP'
}];

for (let i = 10; i; i--){
  trades.push(Object.assign({}, trades[0], {
    id: _.uniqueId(),
    direction: _.sample(['buy', 'sell']),
    status: _.sample(['Done', 'Processing', 'Rejected'])
  }));
}

trades.reverse();

export class IndexView extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      trades: []
    };
  }

  componentWillMount(){
    this.setState({
      trades: trades
    });
  }

  addTrade(payload){
    payload.status = _.sample(['Done', 'Processing', 'Rejected']);
    payload.id = _.uniqueId();

    trades.unshift(payload);
    this.setState({
      trades: trades
    });

    rt.execution.executeTrade({
      CurrencyPair: payload.pair,
      SpotRate: payload.rate,
      //todo: support valueDate and non spot
      // ValueDate: (new Date()).toISOString(),
      Direction: payload.direction,
      Notional: payload.amount,
      DealtCurrency: payload.pair.substr(0, 3)
    }).then((response) =>{

        const trade = response.Trade;
        const dt = new Date(trade.ValueDate);

        const result = {
          pair: trade.CurrencyPair,
          id: trade.TradeId,
          status: trade.Status,
          direction: trade.Direction,
          amount: trade.Notional,
          trader: trade.TraderName,
          valueDate: trade.ValueDate, // todo get this from DTO
          rate: trade.SpotRate
        };

        console.log(payload, response.Trade, result);
        payload.onACK(result);
      }, (error) =>{
        console.error(error);
        console.trace();
      }
    );
  }

  render(){
    return (
      <div className=''>
        <CurrencyPairs onExecute={(payload) => this.addTrade(payload)}/>
        <Blotter trades={this.state.trades}/>
      </div>
    );
  }
}

export default IndexView;
