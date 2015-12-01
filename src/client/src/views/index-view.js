import React from 'react';
import CurrencyPairs from '../components/currency-pairs';
import Blotter from '../components/blotter';
import Modal from '../components/modal';

import rt from '../classes/services/reactive-trader';

/**
 *
 * @param DTO
 * @returns {{id: *, trader: (*|string), status: *, direction: *, pair: *, rate: *, dateTime: *, valueDate: *, amount: *}}
 */
const formatTradeForDOM = (DTO) =>{
  return {
    id: DTO.TradeId,
    trader: DTO.TraderName,
    status: DTO.Status,
    direction: DTO.Direction,
    pair: DTO.CurrencyPair,
    rate: DTO.SpotRate,
    dateTime: DTO.TradeDate,
    valueDate: DTO.ValueDate,
    amount: DTO.Notional
  };
};

export class IndexView extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      trades: []
    };

    rt.blotter.getTradesStream((blotter) =>{
      blotter.Trades.forEach((trade) => this._processTrade(trade, false));

      this.setState({
        trades: this.state.trades
      });
    });
  }

  reconnect(){
    Modal.close();
    rt.transport.open();
  }

  componentDidMount(){
    rt.on('timeout', () => {
      Modal.setTitle('Session expired')
        .setBody(<div>
          <div>Your 15 minute session expired, you are now disconnected from the server.</div>
          <div>Click reconnect to start a new session.</div>
          <div className='modal-action'>
            <button className='btn btn-large' onClick={() => this.reconnect()}>Reconnect</button>
          </div>
        </div>)
        .setClass('error-modal')
        .open();
    });
  }

  /**
   * Processor for data coming from the blotter service that converts DTO object to DOM
   * @param {Object} trade
   * @param {Boolean=} update immediately, defaults to false
   * @private
   */
  _processTrade(trade, update){
    trade = formatTradeForDOM(trade);
    const exists = _.findWhere(this.state.trades, {id: trade.id});

    if (!exists){
      this.state.trades.unshift(trade);
    }
    else {
      this.state.trades[_.indexOf(this.state.trades, exists)] = trade;
    }

    update && this.setState({
      trades: this.state.trades
    });
  }

  /**
   * Sends a trade to execution service, preps response back for show in CP tile
   * @param {Object} payload
   */
  addTrade(payload){
    rt.execution.executeTrade({
      CurrencyPair: payload.pair,
      SpotRate: payload.rate,
      //todo: support valueDate and non spot
      // ValueDate: (new Date()).toISOString(),
      Direction: payload.direction,
      Notional: payload.amount,
      DealtCurrency: payload.pair.substr(payload.direction === 'buy' ? 0 : 3, 3)
    }).then((response) =>{
        const trade = response.Trade,
              dt    = new Date(trade.ValueDate);

        payload.onACK({
          pair: trade.CurrencyPair,
          id: trade.TradeId,
          status: trade.Status,
          direction: trade.Direction.toLowerCase(),
          amount: trade.Notional,
          trader: trade.TraderName,
          valueDate: trade.ValueDate, // todo get this from DTO
          rate: trade.SpotRate
        });
      }, (error) =>{
        console.error(error);
        console.trace();
      }
    );
  }

  render(){
    return <div>
      <Modal/>
      <CurrencyPairs onExecute={(payload) => this.addTrade(payload)}/>
      <Blotter trades={this.state.trades}/>
    </div>;
  }
}

export default IndexView;
