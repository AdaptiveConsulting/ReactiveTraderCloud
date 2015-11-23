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
  pip: 5,
  lastUpdated: Date.now()
}, {
  pair: 'CHFEUR',
  buy: 0.955,
  sell: 0.965,
  id: 2,
  precision: 5,
  pip: 5,
  lastUpdated: Date.now()
}, {
  pair: 'GBPJPY',
  buy: 163.871,
  sell: 163.920,
  id: 3,
  precision: 5,
  pip: 5,
  lastUpdated: Date.now()
}];

const STALE_TIMEOUT = 5000;


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
        p = _.sample(pairs),
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

      p.lastUpdated = Date.now();

      pairs.forEach((pair) => {
        pair.state = Date.now() - (pair.lastUpdated || 0) > STALE_TIMEOUT ? 'stale' : 'listening';
      });

      this.setState({
        pairs
      });

      setTimeout(tick, rand * pairs.length * 1500);
    };

    tick();
  }

  onACK(payload){
    const pairs = this.state.pairs,
          pair = _.findWhere(pairs, {pair: payload.pair});

    pair.state = 'listening';
    pair.response = payload;

    this.setState({
      pairs
    });
  }

  componentDidUpdate(){
    // silently remove last response
    this.state.pairs.forEach((pair)=>{
      delete pair.response;
    });
  }

  onExecute(payload){
    //todo: send to socket.
    if (this.props.onExecute){
      const pair = _.findWhere(this.state.pairs, {pair: payload.pair});
      pair.state = 'executing';

      payload.onACK = (...args) => this.onACK(...args);

      this.props.onExecute(payload);
    }
  }

  render(){
    return <div className='currency-pairs'>
      {this.state.pairs.map((cp) => {
        const spread = (Math.abs(cp.buy - cp.sell)).toFixed(2),
          response = cp.response;

        return <CurrencyPair onExecute={(payload) => this.onExecute(payload)}
                             pair={cp.pair}
                             size="100m"
                             key={cp.id}
                             buy={cp.buy}
                             sell={cp.sell}
                             precision={cp.precision}
                             pip={cp.pip}
                             state={cp.state}
                             response={response}
                             spread={spread} />
      })}
    </div>
  }
}

export default CurrencyPairs;
