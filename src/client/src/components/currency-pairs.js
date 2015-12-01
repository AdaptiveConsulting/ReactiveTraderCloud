import React from 'react';
import CurrencyPair from './currency-pair';
import Header from './header';
import _ from 'lodash';

import rt from '../classes/services/reactive-trader';

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
      pairs: [],
      connected: false,
      services: {}
    };

    this.subscribed = [];
  }

  /**
   * Deals with socket comms for pairs - gets reference data, subscribes to each pair.
   */
  attachSubs(){

    this.setState({
      connected: rt.transport.isOpen,
      services: rt.transport.getStatus()
    });

    const updatePairs = (src) =>{
      const pairs = src || this.state.pairs;

      pairs.forEach((pair) =>{
        const timeOutState = Date.now() - (pair.lastUpdated || 0) > STALE_TIMEOUT ? 'stale' : 'listening';
        // if either pricing or execution reports down, we cannot trade.
        pair.state = this.state.services.pricing && this.state.services.execution ? timeOutState : 'stale';
      });

      this.setState({
        pairs: pairs
      });
    };

    rt.reference.getCurrencyPairUpdatesStream((referenceData) =>{
      const pairs = this.state.pairs;
      let hasUpdates = false;

      // loop through updates
      _.forEach(referenceData.Updates, (updatedPair) =>{
        const pairData = updatedPair.CurrencyPair;

        // added new?
        if (updatedPair.UpdateType == 'Added'){
          let localPair = {
            pip: pairData.PipsPosition,
            precision: pairData.RatePrecision,
            pair: pairData.Symbol,
            id: pairData.Symbol,
            buy: undefined,
            sell: undefined
          };

          let existingPair = _.findWhere(pairs, {id: localPair.id});

          // only subscribe if we don't already listen for prices
          if (!existingPair){
            localPair.pricingSub = rt.pricing.getPriceUpdates(localPair.id, (priceData) =>{
              // console.info(priceData, localPair);
              localPair.buy = Number(priceData.bid);
              localPair.sell = Number(priceData.ask);
              localPair.mid = Number(priceData.mid);

              localPair.lastUpdated = Date.now();
              updatePairs();
            });

            hasUpdates = true;
            pairs.push(localPair);
          }
          else {
            console.warn('already exists', this.state.pairs, existingPair);
          }
        }
        else {
          // removed existing?
          rt.pricing.unsubscribe(existingPair.pricingSub);
          pairs.splice(_.indexOf(pairs, existingPair), 1);
          hasUpdates = true;
        }
      });

      // update state if we detected changes
      hasUpdates && updatePairs();
    });

    const self = this;

    rt.transport
      .on('open', ()=> self.setState({connected: true}))
      .on('close', ()=> self.setState({connected: false}))
      .on('statusUpdate', (services) =>{
        // update ui indicators
        self.setState({
          services
        });
        // also update pairs in case pricing has gone down
        updatePairs();
      });
  }

  componentWillMount(){
    this.attachSubs();
  }

  onACK(payload){
    const pairs = this.state.pairs,
          pair  = _.findWhere(pairs, {pair: payload.pair});

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
    const p = this.state.pairs.filter((a) =>{
      return a.buy && a.sell;
    });

    return <div>

      <Header status={this.state.connected} services={this.state.services}/>
      <div className='currency-pairs'>
        {p.length ? p.map((cp) => <CurrencyPair onExecute={(payload) => this.onExecute(payload)}
                                                pair={cp.pair}
                                                size="100m"
                                                key={cp.id}
                                                buy={cp.buy}
                                                sell={cp.sell}
                                                mid={cp.mid}
                                                precision={cp.precision}
                                                pip={cp.pip}
                                                state={cp.state}
                                                response={cp.response}/>) :
          <div className="text-center"><i className="fa fa-5x fa-cog fa-spin"></i></div> }
      </div>
    </div>;
  }
}

export default CurrencyPairs;
