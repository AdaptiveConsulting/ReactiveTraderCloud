import _ from 'lodash';
import { observeEvent } from 'esp-js';
import { viewBinding } from 'esp-js-react';
import { Environment } from '../../../system';
import { ModelBase, RegionManagerHelper } from '../../common';
import { RegionNames, view  } from '../../regions';
import { TradeRow, TradeStatus, TradeNotification, RegionSettings } from '../../../services/model';
import { BlotterView } from '../views';

import logger from '../../../system/logger';
var _log = logger.create('BlotterModel');

const HIGHLIGHT_TRADE_FOR_IN_MS = 200;

@viewBinding(BlotterView)
export default class BlotterModel extends ModelBase {
  _blotterService;
  _regionManagerHelper;
  _regionManager;
  _regionName;
  _regionSettings;
  _schedulerService;
  trades;
  isConnected;

  constructor(
    modelId,
    router,
    blotterService,
    regionManager,
    openFin,
    schedulerService,
  ) {
    super(modelId, router);
    this._blotterService = blotterService;
    this.trades = [];
    this.isConnected = false;
    this._regionManager = regionManager;
    this._regionName = RegionNames.blotter;
    this._regionSettings = new RegionSettings('Blotter', 850, 280, false);
    this._regionManagerHelper = new RegionManagerHelper(this._regionName, regionManager, this, this._regionSettings);
    this._openFin = openFin;
    this._schedulerService = schedulerService;
  }

  get canPopout() {
    return Environment.isRunningInIE;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Blotter starting`);
    this._subscribeToConnectionStatus();
    this._regionManagerHelper.init();
    this.subscribeToOpenFinEvents();
  }

  @observeEvent('referenceDataLoaded')
  _onReferenceDataLoaded() {
    _log.info(`Ref data loaded, subscribing to trade stream`);
    this._subscribeToTradeStream();
  }

  @observeEvent('tearOffBlotter')
  _onTearOffBlotter() {
    _log.info(`Popping out blotter`);
    this._regionManagerHelper.popout();
  }

  @observeEvent('highlightTradeRow')
  _highlightTradeRow(e) {
    let index = _.findIndex(this.trades, traderRow => traderRow.trade.tradeId === e.trade.tradeId);
    if (index >= 0) {
      _log.debug(`Highlight trade ${e.trade.tradeId}`);
      this.trades[index].isInFocus = true;
      this._schedulerService.async.scheduleFuture('', HIGHLIGHT_TRADE_FOR_IN_MS, () => this.router.publishEvent(this.modelId, 'endHighlightTradeRow', {trade: e.trade}));
    }
  }

  @observeEvent('endHighlightTradeRow')
  _endHighlightTradeRow(e) {
    let index = _.findIndex(this.trades, traderRow => traderRow.trade.tradeId === e.trade.tradeId);
    if (index >= 0) {
      _log.debug(`Stop highlighting trade ${e.trade.tradeId}`);
      this.trades[index].isInFocus = false;
    }
  }

  subscribeToOpenFinEvents(){
    this._openFin.addSubscription('fetch-blotter', (msg, uuid) => {
      let serialisedTrades = this.trades.map((t) => new TradeNotification(t.trade));
      this._openFin.sendAllBlotterData(uuid, serialisedTrades);
    });
  }

  _subscribeToTradeStream() {
    this._disposables.add(
      this._blotterService.getTradesStream()
        .subscribeWithRouter(
          this.router,
          this.modelId,
          (tradesUpdate) => {
            let trades = tradesUpdate.trades;

            if (tradesUpdate.isStateOfTheWorld) {
              this.trades = _.sortBy(tradesUpdate.trades, 'tradeId').reverse().map(trade => new TradeRow(trade));
            }else{
              _.forEach(trades, (trade) => {
                let existingTradeIndex = _.findIndex(this.trades, (t) => t.trade.tradeId === trade.tradeId);
                if (existingTradeIndex !== -1) {
                  //update the existing trade
                  this.trades[existingTradeIndex] = new TradeRow(trade);
                } else {
                  //add the existing trade and mark it as new
                  const tradeRow = new TradeRow(trade);
                  this.trades.unshift(tradeRow);
                  tradeRow.isNew = true;
                }

                //display a notification if the trade has a final status (Done or Rejected);
                if ((trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected)) {
                  this._openFin.openTradeNotification(trade);
                }
              });
            }
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
        (status) => {
          this.isConnected = status.isConnected;
          if (!this.isConnected){
            this.trades = [];
          }
        })
    );
  }
}
