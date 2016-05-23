import Rx from 'rx';
import _ from 'lodash';
import { Router,  observeEvent } from 'esp-js/src';
import { BlotterService } from '../../../services';
import { ServiceStatus } from '../../../system/service';
import { logger } from '../../../system';
import { ModelBase, RegionManagerHelper } from '../../common';
import { RegionManager, RegionNames, view  } from '../../regions';
import { OpenFin } from '../../../system/openFin';
import { Trade, TradesUpdate, TradeStatus } from '../../../services/model';

import { BlotterView } from '../views';

var _log:logger.Logger = logger.create('BlotterModel');

@view(BlotterView)
export default class BlotterModel extends ModelBase {
  _blotterService:BlotterService;
  _regionManagerHelper:RegionManagerHelper;

  trades:Array<Trade>;
  isConnected:boolean;

  constructor(
    modelId:string,
    router:Router,
    blotterService:BlotterService,
    regionManager:RegionManager,
    openFin: OpenFin
  ) {
    super(modelId, router);
    this._blotterService = blotterService;
    this.trades = [];
    this.isConnected = false;
    this._regionManagerHelper = new RegionManagerHelper(RegionNames.blotter, regionManager, this);
    this._openFin = openFin;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Blotter starting`);
    this._subscribeToConnectionStatus();
    this._regionManagerHelper.addToRegion();
  }

  @observeEvent('referenceDataLoaded')
  _onReferenceDataLoaded() {
    _log.info(`Ref data loaded, subscribing to trade stream`);
    this._subscribeToTradeStream();
  }

  @observeEvent('tearOffBlotter')
  _onTearOffBlotter() {
    _log.info(`Popping out blotter`);
    this._regionManagerHelper.popout('Blotter', 850, 280);
  }

  _subscribeToTradeStream() {
    this._disposables.add(
      this._blotterService.getTradesStream()
        .subscribeWithRouter(
          this.router,
          this.modelId,
          (tradesUpdate:TradesUpdate) => {
            let trades = tradesUpdate.trades;

            if (tradesUpdate.isStateOfTheWorld) {
              this.trades = this.trades.concat(_.sortBy(tradesUpdate.trades, 'tradeId').reverse());
            }else{
              _.forEach(trades, (trade:Trade) => {
                let existingTradeIndex = _.findIndex(this.trades, (t) => t.tradeId === trade.tradeId );
                if (existingTradeIndex !== -1){
                  //update the existing trade
                  this.trades[existingTradeIndex] = trade;
                }else{
                  //add the existing trade and mark it as new
                  this.trades.unshift(trade);
                  trade.isNew = true;
                }

                //display a notification if the trade has a final status (Done or Rejected);
                if ((trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected)){
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
        (status:ServiceStatus) => {
          this.isConnected = status.isConnected;
          if (!this.isConnected){
            this.trades = [];
          }
        })
    );
  }
}
