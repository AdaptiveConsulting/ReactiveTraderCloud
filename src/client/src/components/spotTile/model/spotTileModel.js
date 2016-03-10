import Rx from 'rx';
import { Router, observeEvent } from 'esp-js/src';
import { PricingService, ExecutionService } from '../../../services';
import { logger } from '../../../system';
import { ModelBase } from '../../common';
import { TradeExecutionNotification, TextNotification, NotificationBase, NotificationType } from './';
import {
  GetSpotStreamRequest,
  SpotPrice,
  Direction,
  ExecuteTradeRequest,
  CurrencyPair,
  ExecuteTradeResponse
} from '../../../services/model';

let modelIdKey = 1;

export default class SpotTileModel extends ModelBase {
  // non view state
  _pricingService:PricingService;
  _executionService:ExecutionService;
  _executionDisposable:Rx.SerialDisposable;
  _priceSubscriptionDisposable:Rx.SerialDisposable;
  _log:logger.Logger;

  // React doesn't seem to pickup ES6 properties (last time I looked it seemed to be because Babel doesn't spit them out as enumerable)
  // So we're just exposing the state as fields.
  currencyPair:CurrencyPair;
  currentSpotPrice:SpotPrice;
  historicMidSportRates:Array<Number>;
  notification:NotificationBase;
  shouldShowChart:boolean;
  tileTitle:string;
  notional:number;
  pricingConnected:boolean;
  executionConnected:boolean;
  isTradeExecutionInFlight:boolean;

  constructor(currencyPair:CurrencyPair, // in a real system you'd take a specific state object, not just a piece of state (currencyPair) as we do here
              router:Router,
              pricingService:PricingService,
              executionService:ExecutionService) {
    super((`spotTile` + modelIdKey++), router);
    this._log = logger.create(`${this.modelId}:${currencyPair.symbol}`);// can't change ccy pair in this demo app, so reasonable to use the symbol in the logger name
    this._pricingService = pricingService;
    this._executionService = executionService;
    this.currencyPair = currencyPair;
    this._executionDisposable = new Rx.SerialDisposable();
    this.addDisposable(this._executionDisposable);
    this._priceSubscriptionDisposable = new Rx.SerialDisposable();
    this.addDisposable(this._priceSubscriptionDisposable);

    this.historicMidSportRates = [];
    this.shouldShowChart = true;
    this.tileTitle = currencyPair.symbol;
    this.notification = null;
    this.notional = 1000000;
    this.currentSpotPrice = null;

    // If things get much messier we could look at introducing a state machine, but for now we really only have these 3 conditions to worry about
    this.pricingConnected = false;
    this.executionConnected = false;
    this.isTradeExecutionInFlight = false;
  }

  get hasNotification() {
    return this.notification !== null;
  }

  @observeEvent('init')
  _onInit() {
    this._log.info(`Cash tile starting for pair ${this.currencyPair.symbol}`);
    this._subscribeToPriceStream();
    this._subscribeToConnectionStatus();
  }

  @observeEvent('tileClosed')
  _onTileClosed() {
    this._log.info(`Cash tile closing`);
    // TODO
  }

  @observeEvent('popOutTile')
  _onPopOutTile(e:{notional:number}) {
    this._log.info(`Popping out tile`);
    // TODO
  }

  @observeEvent('toggleSparkLineChart')
  _onToggleSparkLineChart() {
    this._log.debug(`toggling spark line chart`);
    this.shouldShowChart = !this.shouldShowChart;
  }

  @observeEvent('tradeNotificationDismissed')
  _onTradeNotificationDismissed() {
    this._log.debug(`message dismissed`);
    this.notification = null;
    this._updatePricingDownStatusNotification();
  }

  @observeEvent('notionalChanged')
  _onNotionalChanged(e:{notional:number}) {
    this._log.info(`Updating notional to ${e.notional}`);
    this.notional = e.notional;
  }

  @observeEvent('executeTrade')
  _onExecuteTrade(e:{direction:Direction}) {
    if (this.pricingConnected && this.executionConnected) {
      // stop the price stream so the users can see what the traded
      let request = this._createTradeRequest(e.direction);
      this._log.info(`Will execute ${request.toString()}`);
      this.isTradeExecutionInFlight = true;
      this._executionDisposable.setDisposable(
        this._executionService.executeTrade(request).subscribeWithRouter(
          this.router,
          this.modelId,
          (response:ExecuteTradeResponse) => {
            this.isTradeExecutionInFlight = false;
            this.notification = response.hasError
              ? TradeExecutionNotification.createForError(response.error)
              : TradeExecutionNotification.createForSuccess(response.trade);
          },
          err => {
            this.isTradeExecutionInFlight = false;
            this._log.error(`Error executing ${request.toString()}. ${err}`, err);
            this.notification = TradeExecutionNotification.createForError(`Unknown stream error`);
          })
      );
    } else {
      this._log.warn(`Ignoring execute request as we can't trade with pricing and execution down`);
    }
  }

  _createTradeRequest(direction:Direction) {
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
    this._priceSubscriptionDisposable.setDisposable(
      this._pricingService
        .getSpotPriceStream(new GetSpotStreamRequest(this.currencyPair.symbol))
        .subscribeWithRouter(
          this.router,
          this.modelId,
          (price:SpotPrice) => {
            // we don't update the price if we have an inflight trade, the users will want to see what they are buying
            if(!this.isTradeExecutionInFlight) {
              this.currentSpotPrice = price;
            }
            this._updateHistoricalPrices(price);
          },
          err => {
            this._log.error('Error on getSpotPriceStream stream stream', err);
          }
        )
    );
  }

  _updateHistoricalPrices(price:SpotPrice) {
    this.historicMidSportRates.push(price.mid.rawRate);
    // we only keep a limited amount of historical prices
    if(this.historicMidSportRates.length > 30) {
      this.historicMidSportRates.shift(); // pop the first element
    }
  }

  _subscribeToConnectionStatus() {
    let serviceStatusStream = Rx.Observable.combineLatest(
      this._pricingService.serviceStatusStream,
      this._executionService.serviceStatusStream,
      (pricingStatus, executionStatus) => {
        return {
          pricingConnected: pricingStatus.isConnected,
          executionConnected: executionStatus.isConnected
        };
      }
    );
    this.addDisposable(
      serviceStatusStream.subscribeWithRouter(
        this.router,
        this._modelId,
        (tuple:{pricingConnected:boolean, executionConnected:boolean}) => {
          if(this.pricingConnected && !tuple.pricingConnected) {
            this.historicMidSportRates.length = 0; // clear out the charts prices
          }
          this.pricingConnected = tuple.pricingConnected;
          this.executionConnected = tuple.executionConnected;
          this._updatePricingDownStatusNotification();
        })
    );
  }

  _updatePricingDownStatusNotification() {
    if(this.notification === null || this.notification.notificationType === NotificationType.Text) {
        if (this.pricingConnected) {
          this.notification = null;
        } else {
          this.notification = new TextNotification('Pricing is unavailable');
        }
    }
  }
}
