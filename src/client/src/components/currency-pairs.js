import React from 'react';
import CurrencyPair from './currency-pair';
import _ from 'lodash';

import transport from '../utils/transport';


//todo: hook up socket stream
let pairs = [];

const STALE_TIMEOUT = 4000;


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
    };

    this.subscribed = [];
  }

  /**
   * Deals with socket comms for pairs - gets reference data, subscribes to each pair.
   */
  attachSubs(){
    transport.subscribe('reference.getCurrencyPairUpdatesStream', (referenceData) => {
      const update = _.debounce((src) => {
        const pairs = src || this.state.pairs;

        pairs.forEach((pair) => {
          pair.state = Date.now() - (pair.lastUpdated || 0) > STALE_TIMEOUT ? 'stale' : 'listening';
        });

        this.setState({
          pairs: pairs
        });
      }, 5);

      // normalise the currency pair reference data
      const pairs = _.map(referenceData.Updates, (updatedPair) => {
        const pair = updatedPair.CurrencyPair;

        if (updatedPair.UpdateType == 0){


          return {
            //todo: accept rawPair.PipPosition and rawPair.RatePrecision
            pip: 5,
            precision: 5,
            pair: pair.Symbol,
            id: pair.Symbol,
            buy: undefined,
            sell: undefined
          };
        }
        else {
          // removed?
          // console.log(updatedPair.UpdateType);
          update(this.state.pairs.filter((p) => p.id != pair.Symbol));
          transport.unsubscribe('pricing.getPriceUpdates', existing.handler, {id: pair.Symbol})
        }
      }, this);

      this.setState({
        pairs: pairs
      });

      // subscribe to individual streams
      this.state.pairs.forEach((pair) => {
        transport.subscribe('pricing.getPriceUpdates', pair.handler = (priceData) => {
          let existingPair = _.findWhere(this.state.pairs, {id: priceData.symbol});

          if (!existingPair){
            //todo: we should unsubscribe!
            return;
          }

          existingPair.buy = Number(priceData.bid);
          existingPair.sell = Number(priceData.ask);

          existingPair.lastUpdated = Date.now();

          update();
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
    // filter cps that have got price data only.
    const p = this.state.pairs.filter((a) => {
      return a.buy && a.sell;
    });

    return <div>
      <nav className='navbar navbar-default'>
        <a className='navbar-brand' href='/'>ReactiveTrader</a>
        <ul className='nav navbar-nav hidden-xs navbar-left'>
          <li>
            <a href='/admin' className='nav-link' activeClassName='active'>Admin Cluster</a>
          </li>
        </ul>
        <ul className="nav navbar-nav pull-right">
          <li><a href="#" name='status'>{p.length ? 'online' : 'Waiting for pricing data...'}</a></li>
        </ul>
      </nav>
      <div className='currency-pairs container'>
        {p.length ? p.map((cp) => {
          return <CurrencyPair onExecute={(payload) => this.onExecute(payload)}
                               pair={cp.pair}
                               size="100m"
                               key={cp.id}
                               buy={cp.buy}
                               sell={cp.sell}
                               precision={cp.precision}
                               pip={cp.pip}
                               state={cp.state}
                               response={cp.response} />
        }) : <div className="text-center"><i className="fa fa-5x fa-cog fa-spin"></i></div> }
      </div>
    </div>
  }
}

export default CurrencyPairs;
