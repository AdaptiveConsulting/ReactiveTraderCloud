import React from 'react';
import CurrencyPair from './currency-pair';

//todo: hook up socket stream
const pairs = [{
  pair: 'EURGBP',
  buy: 1.44,
  sell: 1.42,
  id: 1
}];

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
      pairs: []
    }
  }

  componentWillMount(){
    this.setState({
      pairs: pairs
    });
  }

  onExecute(payload){
    //todo: send to socket.
  }

  render(){
    return <div className='currency-pairs'>
      {this.state.pairs.map((cp) => {
        const spread = Math.abs(cp.buy - cp.sell);
        return <CurrencyPair onExecute={(payload) => this.onExecute(payload)}
                             pair={cp.pair}
                             size="100m"
                             key={cp.id}
                             buy={cp.buy}
                             sell={cp.sell}
                             spread={spread} />
      })}
    </div>
  }
}

export default CurrencyPairs;
