import Rx from 'rx';
import _ from 'lodash';
import { Router,  observeEvent } from 'esp-js/src';
import { BlotterService } from '../../../services';
import { ServiceStatus } from '../../../system/service';
import { logger } from '../../../system';
import { ModelBase } from '../../common';
import {
  Trade,
} from '../../../services/model';

var _log:logger.Logger = logger.create('BlotterModel');

export default class BlotterModel extends ModelBase {
  _blotterService:BlotterService;

  trades:Array<Trade>;
  isConnected:boolean;

  constructor(modelId:string, router:Router, blotterService:BlotterService) {
    super(modelId, router);
    this._blotterService = blotterService;
    this.trades = [];
    this.isConnected = false;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Blotter starting`);
    this._subscribeToConnectionStatus();
  }

  @observeEvent('referenceDataLoaded')
  _onReferenceDataLoaded() {
    _log.info(`Ref data loaded, subscribing to trade stream`);
    this._subscribeToTradeStream();
  }

  @observeEvent('tearOffBlotter')
  _onTearOffBlotter() {
    _log.info(`Tearing off botter`);

  }

  _subscribeToTradeStream() {
    this._disposables.add(
      this._blotterService.getTradesStream()
        .subscribeWithRouter(
          this.router,
          this.modelId,
          (trades:Array<Trade>) => {
          _.forEach(trades, (trade:Trade) => {
            let exists = _.findWhere(this.trades, {tradeId: trade.tradeId});
            if (exists) {
              this.trades[_.indexOf(this.trades, exists)] = trade;
            }
            else {
              this.trades.unshift(trade);
            }
          });
        },
        err => {
          _log.error('Error on blotterService stream stream', err);
        })
    );
  }

  _subscribeToConnectionStatus() {
    this.addDisposable(
      this._blotterService.serviceStatusStream.subscribeWithRouter(
        this.router,
        this.modelId,
        (status:ServiceStatus) => {
          this.isConnected = status.isConnected;
        })
    );
  }
}
