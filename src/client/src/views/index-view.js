import React from 'react';
import CurrencyPairs from 'components/currency-pairs';
import Blotter from 'components/blotter';
import Modal from 'components/modal';
import Header from 'components/header';
import Analytics from 'components/analytics';
import system from 'system';
import Rx from 'rx';
import { serviceContainer, model as serviceModel } from 'services';

var _log:system.logger.Logger = system.logger.create('index-view');

/**
 *
 * @param DTO
 * @returns {{id: *, trader: (*|string), status: *, direction: *, pair: *, rate: *, dateTime: *, valueDate: *, amount: *}}
 */
const formatTradeForDOM = (DTO) => {
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

class IndexView extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      trades: [],
      history: [],
      positions: [],
      connected: false,
      services: {}
    };
    this._disposables = new Rx.CompositeDisposable();
  }

  componentDidMount() {
    this._disposables.add(
      serviceContainer.blotterService.getTradesStream().subscribe(blotter => {
          blotter.Trades.forEach((trade) => this._processTrade(trade, false));
          this.setState({
            trades: this.state.trades
          });
        },
        err => {
          _log.error(`Error on blotterService stream stream ${err.message}`);
        }
      )
    );

    this._disposables.add(
      serviceContainer.analyticsService.getAnalyticsStream(new serviceModel.AnalyticsRequest('USD')).subscribe(data => {
          this.setState({
            history: data.History,
            positions: data.CurrentPositions
          });
        },
        err => {
          _log.error(`Error on analyticsService stream stream ${err.message}`);
        }
      )
    );

    this._disposables.add(
      serviceContainer.connectionStatusStream
        .subscribe((status:String) => {
            var isConnected = status === system.service.ConnectionStatus.connected;
            this.setState({connected: isConnected});
            if (status === system.service.ConnectionStatus.sessionExpired) {
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
          err => {
            _log.error(`Error on connection status stream ${err.message}`);
          }
        )
    );
  }

  componentWillUnmount() {
    this._disposables.dispose();
  }

  /**
   * Re-establishes a connection to broker once the session expires
   */
  reconnect() {
    Modal.close();
    serviceContainer.reConnect();
  }

  /**
   * Processor for data coming from the blotter service that converts DTO object to DOM
   * @param {Object} trade
   * @param {Boolean=} update immediately, defaults to false
   * @private
   */
  _processTrade(trade, update) {
    trade = formatTradeForDOM(trade);
    const exists = _.findWhere(this.state.trades, {id: trade.id});

    if (!exists) {
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
  addTrade(payload) {
    var request = {
      CurrencyPair: payload.pair,
      SpotRate: payload.rate,
      //todo: support valueDate and non spot
      // ValueDate: (new Date()).toISOString(),
      Direction: payload.direction,
      Notional: payload.amount,
      DealtCurrency: payload.pair.substr(payload.direction === 'buy' ? 0 : 3, 3)
    };
    // TODO proper handling of trade execution flow errors and disposal
    serviceContainer.executionService.executeTrade(request).subscribe(response => {
        const trade = response.Trade,
          dt = new Date(trade.ValueDate),
          message = {
            pair: trade.CurrencyPair,
            id: trade.TradeId,
            status: trade.Status,
            direction: trade.Direction.toLowerCase(),
            amount: trade.Notional,
            trader: trade.TraderName,
            valueDate: trade.ValueDate, // todo get this from DTO
            rate: trade.SpotRate
          };

        window.fin && new window.fin.desktop.Notification({
          url: '/#/growl',
          message,
          onClick: function () {
            const win = window.fin.desktop.Window.getCurrent();
            win.getState(state => {
              switch (state) {
                case 'minimized':
                  win.restore();
                default:
                  win.bringToFront();
              }
            });

            window.fin.desktop.InterApplicationBus.publish('acknowledgeTrade', message.id);
          }
        });
        payload.onACK(message);
      },
      (error) => {
        _log.error(error.message);
      }
    );
  }

  render() {
    const services = this.state.services;
    return (
      <div>
        <Modal/>
        <Header status={this.state.connected} />
        <CurrencyPairs onExecute={(payload) => this.addTrade(payload)} />
        <Analytics history={this.state.history} positions={this.state.positions}/>
        <Blotter trades={this.state.trades} />
      </div>
    );
  }

}

export default IndexView;
