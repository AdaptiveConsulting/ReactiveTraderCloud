import React from 'react';
import CurrencyPairs from '../components/currency-pairs';
import Blotter from '../components/blotter';

import transport from '../utils/transport';


//todo: remove mocks
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  today = new Date();

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

    setTimeout(() => {
      payload.onACK(payload);
    }, 500);
  }

  render(){
    return (
      <div className=''>
        <CurrencyPairs onExecute={(payload) => this.addTrade(payload)}/>
        <Blotter trades={this.state.trades} />
      </div>
    );
  }
}

export default IndexView;
