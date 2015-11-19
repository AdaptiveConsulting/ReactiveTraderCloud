import React from 'react';
import CurrencyPair from './currency-pair';
import _ from 'lodash';

//todo: hook up socket stream
const pairs = [{
  pair: 'EURGBP',
  buy: 1.44,
  sell: 1.42,
  id: 1,
  precision: 5,
  pip: 5
}, {
  pair: 'CHFEUR',
  buy: 0.955,
  sell: 0.965,
  id: 2,
  precision: 5,
  pip: 5
}, {
  pair: 'GBPJPY',
  buy: 163.871,
  sell: 163.920,
  id: 3,
  precision: 5,
  pip: 5
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
      // actual pair is by reference. oh no!
      const
        item = _.random(0, pairs.length - 1),
        p = pairs[item],
        rand = Math.random(),
        rand2 = Math.random() * .01;

      if (rand > .5){
        p.buy = p.buy + rand2;
        p.sell = p.sell + rand2;
      }
      else {
        p.buy = p.buy - rand2;
        p.sell = p.sell - rand2;
      }

      this.setState({
        pairs
      });

      setTimeout(tick, rand * pairs.length * 600);
    };

    tick();
  }

  onExecute(payload){
    //todo: send to socket.
  }

  render(){
    return <div className='currency-pairs'>
      {this.state.pairs.map((cp) => {
        const spread = (Math.abs(cp.buy - cp.sell)).toFixed(2);

        return <CurrencyPair onExecute={(payload) => this.onExecute(payload)}
                             pair={cp.pair}
                             size="100m"
                             key={cp.id}
                             buy={cp.buy}
                             sell={cp.sell}
                             precision={cp.precision}
                             pip={cp.pip}
                             spread={spread} />
      })}
    </div>
  }
}

export default CurrencyPairs;
