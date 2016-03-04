import React from 'react';
// import WorkspaceView from './workspaceView';
import { WorkspaceView } from '../../workspace/views';
import Blotter from '../../blotter/components/blotter';
import Header from '../../header/components/header-view';
import Analytics from '../../analytics/components/analytics';
import common from '../../common';
import system from 'system';
import Rx from 'rx';
import { serviceContainer } from '../../../services';
import { Trade, ExecuteTradeRequest } from '../../../services/model';

var _log:system.logger.Logger = system.logger.create('ShellView');

const Modal = common.components.Modal;

class ShellView extends React.Component {

  constructor(props, context){
    super(props, context);

    this.state = {
      trades: [],
      connected: false,
      services: {}
    };

    this._disposables = new Rx.CompositeDisposable();
  }

  componentDidMount(){
    // TODO all this service code will be lifted out of here to the bootstrapper once proper models
    // are introduced for blotter and analytics
    serviceContainer.referenceDataService.hasLoadedStream.subscribe(() => {
      this._addEvents();
    });
  }

  _addEvents(){
    this._disposables.add(
      serviceContainer.blotterService.getTradesStream().subscribe(trades =>{
          trades.forEach((trade) => this._processTrade(trade, false));
        this.setState({
          trades: this.state.trades
        });
      },
      err =>{
        _log.error('Error on blotterService stream stream', err);
      })
    );

    this._disposables.add(
      serviceContainer.connectionStatusStream.subscribe((status:String) =>{
        const connected = status === system.service.ConnectionStatus.connected;

        this.setState({
          connected
        });

        if (status === system.service.ConnectionStatus.sessionExpired){
          // TODO Lift
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
        }
      },
      err =>{
        _log.error('Error on connection status stream', err);
      })
    );
  }

  componentWillUnmount(){
    this._disposables.dispose();
  }

  /**
   * Re-establishes a connection to broker once the session expires
   */
  reconnect(){
    Modal.close();
    serviceContainer.reConnect();
  }

  /**
   * Processor for data coming from the blotter service that converts DTO object to DOM
   * @param {Object} trade
   * @param {Boolean=} update immediately, defaults to false
   * @private
   */
  _processTrade(trade, update){
    const exists = _.findWhere(this.state.trades, {id: trade.tradeId});

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
    var request = new ExecuteTradeRequest(
      payload.pair,
      payload.rate,
      payload.direction,
      payload.amount,
      payload.pair.substr(payload.direction === 'buy' ? 0 : 3, 3)
    );
    // TODO proper handling of trade execution flow errors and disposal
    let disposable = serviceContainer.executionService.executeTrade(request).subscribe((trade:Trade) =>{
        let message = {
                pair: trade.currencyPair,
                id: trade.tradeId,
                status: trade.status,
                direction: trade.direction.toLowerCase(),
                amount: trade.notional,
                trader: trade.traderName,
                formattedValueDate: trade.formattedValueDate,
                rate: trade.spotRate
              };
        // TODO lift open fin
        window.fin && new window.fin.desktop.Notification({
          url: '/#/growl',
          message,
          onClick: function(){
            const win = window.fin.desktop.Window.getCurrent();
            win.getState(state =>{
              switch (state){
                case 'minimized':
                  win.restore();
                default:
                  win.bringToFront();
              }
            });

            window.fin.desktop.InterApplicationBus.publish('acknowledgeTrade', message.id);
          }
        });
        // massive antipattern, we need to have tiles act on their own accord as smart components
        // not every layer between the top most container and the tile having knowledge of the tiles inner workings
        payload.onACK(message);
      },
      (err) =>{
        _log.error('Error on executeTrade stream', err);
      }
    );
  }

  render(){
    return (
      <div className='flex-container'>
        <common.components.Modal />
        <Header status={this.state.connected}/>
        <div className='horizontal-wrap'>
          {/*onExecute={(payload) => this.addTrade(payload)}*/}
          {/* HACK: workspaceModelId needs to come from the shells model once this view gets updated, not hard coded */}
          <WorkspaceView modelId='workspaceModelId' />
          <Analytics />
        </div>
        <Blotter trades={this.state.trades}   />
      </div>
    );
  }
}

export default ShellView;
