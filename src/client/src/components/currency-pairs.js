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

    // simulate some ticks
    let tick = () => {
      const p = Object.assign({}, pairs[0]),
            rand = Math.random(),
            rand2 = Math.random() * .01;

      if (rand > .5){
        p.buy = Number((p.buy + rand2).toFixed(3));
        p.sell = Number((p.sell + rand2).toFixed(3));
      }
      else {
        p.buy = Number((p.buy - rand2).toFixed(3));
        p.sell = Number((p.sell - rand2).toFixed(3));
      }


      this.setState({
        pairs: [p]
      });
      setTimeout(tick, rand * 3000);
    };

    tick();
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
