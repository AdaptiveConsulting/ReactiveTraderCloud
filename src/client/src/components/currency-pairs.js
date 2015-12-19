import React from 'react';
import _ from 'lodash';

import CurrencyPair from './currency-pair';
import Container from './container';
import rt from 'services/reactive-trader';

const STALE_TIMEOUT = 4000,
      UPDATE_TYPES  = {
        ADD: 'Added',
        UPDATE: 'Updated',
        DELETE: 'Removed'
      };

/**
 * @class CurrencyPairs
 * @extends {React.Component}
 */
class CurrencyPairs extends React.Component {

  static propTypes = {
    services: React.PropTypes.object,
    onExecute: React.PropTypes.func
  }

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
  }

  /**
   * Returns if trading is allowed
   * @returns {Boolean}
   */
  canTrade(){
    return this.props.services.pricing && this.props.services.execution;
  }

  /**
   * Updates pairs state and also marks them as stale when services required are down
   * @param {Array=} src to use or defaults to state.pairs
   */
  updatePairs(src:array){
    const pairs = src || this.state.pairs;

    _.forEach(pairs, (pair) =>{
      const timeOutState = Date.now() - (pair.lastUpdated || 0) > STALE_TIMEOUT ? 'stale' : 'listening';
      // if either pricing or execution reports down, we cannot trade.
      if (pair.state !== 'executing' && pair.state !== 'blocked'){
        pair.state = this.canTrade() && pair.disabled !== true ? timeOutState : 'stale';
      }
      if (!this.props.services.pricing){
        pair.buy = pair.mid = pair.sell = undefined;
      }
    });

    this.setState({
      pairs: pairs
    });
  }

  /**
   * Deals with socket comms for pairs - gets reference data, subscribes to each pair.
   */
  attachSubs(){

    this.setState({
      connected: rt.transport.isOpen,
      services: rt.transport.getStatus()
    });

    const tearoffStates = JSON.parse(localStorage.getItem('pairs')) || {};

    rt.reference.getCurrencyPairUpdatesStream((referenceData) =>{
      let shouldStateUpdate = false;

      if (referenceData.IsStateOfTheWorld && referenceData.Updates.length){
        // compact pairs if it has any instances not in the new state of the world
        const len = this.state.pairs.length,
              ids = _.pluck(referenceData.Updates, 'CurrencyPair.Symbol');

        this.state.pairs = this.state.pairs.filter((pair) =>{
          const pairShouldRemain = _.indexOf(ids, pair.id) !== -1;

          pairShouldRemain || rt.pricing.unsubscribe(pair.pricingSub);

          return pairShouldRemain;
        });

        shouldStateUpdate = len !== this.state.pairs.length;
      }

      // loop through updates
      _.forEach(referenceData.Updates, (updatedPair) =>{
        const pairData = updatedPair.CurrencyPair;

        // added new?
        if (updatedPair.UpdateType === UPDATE_TYPES.ADD){
          let existingPair = _.findWhere(this.state.pairs, {id: pairData.Symbol}),
              localPair    = {
                pip: pairData.PipsPosition,
                precision: pairData.RatePrecision,
                pair: pairData.Symbol,
                id: pairData.Symbol,
                buy: undefined,
                sell: undefined,
                disabled: false,
                tearoff: Boolean(tearoffStates[pairData.Symbol])
              };

          // only subscribe if we don't already listen for prices
          if (!existingPair){
            localPair.pricingSub = rt.pricing.getPriceUpdates(localPair.id, (priceData) =>{
              // console.info(priceData, localPair);
              localPair.sell = Number(priceData.Bid);
              localPair.buy = Number(priceData.Ask);
              localPair.mid = Number(priceData.Mid);

              localPair.lastUpdated = Date.now();
              this.updatePairs();
            });

            shouldStateUpdate = true;
            this.state.pairs.push(localPair);
          }
          else {
            console.warn('Trying to add a pair that already exists', pairData, existingPair);
          }
        }
        else if (updatedPair.UpdateType === UPDATE_TYPES.DELETE){
          // removed existing?
          let existingPair = _.findWhere(this.state.pairs, {id: pairData.Symbol});

          if (existingPair){
            // rt.pricing.unsubscribe(existingPair.pricingSub);
            this.state.pairs.splice(_.indexOf(this.state.pairs, existingPair), 1);
            shouldStateUpdate = true;
          }
        }
      }, this);

      // update state if we detected changes
      shouldStateUpdate && this.updatePairs();
    });

    const self = this;

    rt.transport.on('statusUpdate', ()=> this.updatePairs());
  }

  componentWillMount(){
    this.attachSubs();
  }

  componentDidUpdate(){
    // silently remove last response
    this.state.pairs.forEach((pair)=>{
      delete pair.response;
    });
  }

  /**
   * @param {Object} payload
   */
  onExecute(payload:object){
    const { pairs } = this.state;

    if (this.props.onExecute){
      const pair = _.findWhere(pairs, {pair: payload.pair});
      pair.state = 'executing';

      pair.timer = setTimeout(() => {
        pair.state = 'blocked';

        this.setState({
          pairs
        });
      }, 2000);

      payload.onACK = (...args) => this.onACK(...args);

      this.props.onExecute(payload);
    }
  }

  /**
   * When acknowledge arrives, mark pair as 'listening' again
   * @param {Object} payload
   */
  onACK(payload:object){
    const pairs = this.state.pairs,
          pair  = _.findWhere(pairs, {pair: payload.pair});

    clearTimeout(pair.timer);

    pair.state = 'listening';
    pair.response = payload;

    this.setState({
      pairs
    });
  }

  tearOff(pair, state){
    pair.tearoff = typeof state !== 'undefined' ? state : !pair.tearoff;

    this.setState({
      pairs: this.state.pairs
    });

    const map = {};
    _.forEach(this.state.pairs, (pair) => {
      const { id, tearoff } = pair;
      map[id] = Boolean(tearoff);
    });

    localStorage.setItem('pairs', JSON.stringify(map));
  }

  renderPairs(pairs){
    return pairs.map((cp) => {
      const className = 'currency-pair animated flipInX ' + cp.state;

      return (
        <Container key={cp.id} title={cp.pair} onTearoff={(state) => this.tearOff(cp, state)} tearoff={cp.tearoff} className={className}>
          <CurrencyPair
            onExecute={(payload) => this.onExecute(payload)}
            pair={cp.pair}
            size='1m'
            key={cp.id}
            buy={cp.buy}
            sell={cp.sell}
            mid={cp.mid}
            precision={cp.precision}
            pip={cp.pip}
            state={cp.state}
            response={cp.response}/>
        </Container>
      );
    });
  }

  render(){
    // filter cps that have got price data only.
    const pairs = this.state.pairs;

    return (
      <div className='currency-pairs'>
        {pairs.length ? this.renderPairs(pairs) : <div className='text-center'><i className='fa fa-5x fa-cog fa-spin'/></div>}
        <div className='clearfix'></div>
      </div>
    );
  }
}

export default CurrencyPairs;
