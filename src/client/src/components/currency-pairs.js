import React from 'react';
import CurrencyPair from './currency-pair';
import _ from 'lodash';

import transport from '../utils/transport';


//todo: hook up socket stream
let pairs = [];

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

  /**
   * Deals with socket comms for pairs - gets reference data, subscribes to each pair.
   */
  attachSubs(){
    transport.subscribe('reference.getCurrencyPairUpdatesStream', (referenceData) => {
      // normalise the currency pair reference data
      const pairs = _.pluck(referenceData.Updates, 'CurrencyPair').map((rawPair) => {
        return {
          //todo: accept rawPair.PipPosition and rawPair.RatePrecision
          pip: 5,
          precision: 5,
          pair: rawPair.Symbol,
          id: rawPair.Symbol,
          buy: 0,
          sell: 0
        };
      });

      // subscribe to individual streams
      pairs.forEach((pair) => {
        transport.subscribe('pricing.getPriceUpdates', (priceData) => {
          let found = _.findWhere(this.state.pairs, {id: priceData.symbol});

          if (!found){
            found = _.findWhere(pairs, {id: priceData.symbol});
            this.state.pairs.push(found);
          }

          found.buy = priceData.bid;
          found.sell = priceData.ask;
          this.setState({
            pairs: this.state.pairs
          });
        }, {
          symbol: pair.id
        })
      });
    });
  }

  componentWillMount(){
    if (transport.isOpen){
      this.attachSubs();
    }
    else {
      transport.on('open', () => this.attachSubs());
    }
    this.setState({
      pairs: pairs
    });
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
