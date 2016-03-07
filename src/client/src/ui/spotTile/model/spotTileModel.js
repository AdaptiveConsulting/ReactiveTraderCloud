import Rx from 'rx';
import { Router, model, observeEvent } from 'esp-js/src';
import { ReferenceDataService, PricingService, ExecutionService } from '../../../services';
import { logger } from '../../../system';
import { ServiceStatus } from '../../../system/service';
import { ModelBase } from '../../common';
import { TileStatus, TradeExecutionNotification } from './';
import {
  GetSpotStreamRequest,
  SpotPrice,
  Direction,
  ExecuteTradeRequest,
  Trade,
  CurrencyPair,
  ExecuteTradeResponse,
  CurrencyPairUpdates
} from '../../../services/model';

var _log:logger.Logger = logger.create('SpotTileModel');

let modelIdKey = 1;

export default class SpotTileModel extends ModelBase {
  _referenceDataService:ReferenceDataService;
  _pricingService:PricingService;
  _executionService:ExecutionService;
  _executionDisposable:Rx.SerialDisposable;
  _priceSubscriptionDisposable:Rx.SerialDisposable;

  // React doesn't seem to pickup ES6 properties (last time I looked it seemed to be because Babel doesn't spit them out as enumerable)
  // So we're just exposing the state as fields.
  currencyPair:CurrencyPair;
  currentSpotPrice:SpotPrice;
  status:TileStatus;
  historicMidSportRates:Array<Number>;
  tradeExecutionNotification:TradeExecutionNotification;
  shouldShowChart:Boolean;
  tileTitle:String;
  notional:Number;

  constructor(currencyPair:CurrencyPair, // in a real system you'd take a specific state object, not just a piece of state (currencyPair) as we do here
              router,
              referenceDataService:ReferenceDataService,
              pricingService:PricingService,
              executionService:ExecutionService) {
    super((`spotTileModel` + modelIdKey++), router);
    this._referenceDataService = referenceDataService;
    this._pricingService = pricingService;
    this._executionService = executionService;
    this.currencyPair = currencyPair;
    this._executionDisposable = new Rx.SerialDisposable();
    this.addDisposable(this._executionDisposable);
    this._priceSubscriptionDisposable = new Rx.SerialDisposable();
    this.addDisposable(this._priceSubscriptionDisposable);

    this.status = TileStatus.Idle;
    this.historicMidSportRates = [];
    this.shouldShowChart = true;
    this.tileTitle = currencyPair.symbol;
    this.tradeExecutionNotification = null;
    this.notional = 1000000;
  }

  get hasTradeExecutionNotification() {
    return this.tradeExecutionNotification !== null;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Cash tile starting for pair ${this.currencyPair.symbol}`);
    this._subscribeToPriceStream();
   // this._subscribeToConnectionStatus();
  }

  @observeEvent('tileClosed')
  _onTileClosed() {
    _log.info(`Cash tile closing`);
  }

  @observeEvent('toggleSparkLineChart')
  _onToggleSparkLineChart() {
    _log.debug(`toggling spark line chart`);
    this.shouldShowChart = !this.shouldShowChart;
  }

  @observeEvent('tradeNotificationDismissed')
  _onTradeNotificationDismissed() {
    _log.debug(`message dismissed`);
    this.tradeExecutionNotification = null;
    this._subscribeToPriceStream();
  }

  @observeEvent('notionalChanged')
  _onNotionalChanged(e:{notional:Number}) {
    _log.info(`Updating notional to ${e.notional}`);
    this.notional = e.notional;
  }

  @observeEvent('executeTrade')
  _onExecuteTrade(direction:Direction) {
    if (this.status == TileStatus.Streaming) {
      this.status = TileStatus.Executing;
      // stop the price stream so the users can see what the traded
      this._priceSubscriptionDisposable.getDisposable().dispose();
      let request = this._craeteTradeRequest(direction);
      _log.info(`Will execute ${request.toString()}`);
      this._executionDisposable.setDisposable(
        this._executionService.executeTrade(request).subscribeWithRouter(
          this.router,
          this._modelId,
          (response:ExecuteTradeResponse) => {
            this.status = TileStatus.DisplayingNotification;
            this.tradeExecutionNotification = response.hasError
              ? new TradeExecutionNotification(null, response.error)
              : new TradeExecutionNotification(response.trade);
          },
          err => {
            _log.error(`Error executing ${request.toString()}. ${err}`, err);
            this.status = TileStatus.DisplayingNotification;
            this.tradeExecutionNotification = new TradeExecutionNotification(null, `Unknown stream error`);
          })
      );
    } else {
      _log.warn(`Ignoring execute request as we can't trade at tile status ${this.status.name}`);
    }
  }

  _craeteTradeRequest(direction:Direction) {
    var spotRate = direction == Direction.Buy
      ? this.currentSpotPrice.ask.rawRate
      : this.currentSpotPrice.bid.rawRate;
    var dealtCurrency = direction == Direction.Buy ? this.currencyPair.base : this.currencyPair.terms;
    return new ExecuteTradeRequest(
      this.currencyPair.symbol,
      spotRate,
      direction.name,
      this.notional,
      dealtCurrency
    );
  }

  _subscribeToPriceStream() {
    this.status = TileStatus.Streaming;
    this._priceSubscriptionDisposable.setDisposable(
      this._pricingService
        .getSpotPriceStream(new GetSpotStreamRequest(this.currencyPair.symbol))
        .subscribeWithRouter(
          this.router,
          this._modelId,
          (price:SpotPrice) => {
            if(this.status === TileStatus.Idle) {
              this.status = TileStatus.Streaming;
            }
            this.currentSpotPrice = price;
            this._updateHistoricalPrices(price);
          },
          err => {
            _log.error('Error on getSpotPriceStream stream stream', err);
          }
        )
    );
  }

  _updateHistoricalPrices(price:SpotPrice) {
    this.historicMidSportRates.push(price.mid.rawRate);
    // we only keep a limited amount of historical prices
    if(this.historicMidSportRates.length > 150) {
      this.historicMidSportRates.shift(); // pop the first element
    }
  }

  //_subscribeToConnectionStatus() {
  //  let serviceStatusStream = Rx.Observable.combineLatest(
  //    this._pricingService.serviceStatusStream,
  //    this._executionService.serviceStatusStream,
  //    (pricingStatus, executionStatus) => {
  //      return {
  //        pricingStatus: pricingStatus,
  //        executionStatus: executionStatus
  //      };
  //    });
  //  this.addDisposable(
  //    serviceStatusStream.subscribeWithRouter(
  //      this.router,
  //      this._modelId,
  //      (statusTuple:{pricingStatus:ServiceStatus, executionStatus:ServiceStatus}) => {
  //        let dependenciesUp =
  //          statusTuple.executionStatus == ServiceStatus.isConnected &&
  //          executionStatus.executionStatus == ServiceStatus.isConnected;
  //
  //      })
  //  );
  //}
}
