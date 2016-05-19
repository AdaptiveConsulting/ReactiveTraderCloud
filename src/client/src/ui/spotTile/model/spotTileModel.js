import Rx from 'rx';
import { Router, observeEvent } from 'esp-js/src';
import { PricingService, ExecutionService } from '../../../services';
import { logger } from '../../../system';
import { ModelBase, RegionManagerHelper } from '../../common';
import { TradeExecutionNotification, TextNotification,  NotificationBase, NotificationType } from './';
import { RegionManager, RegionNames, view  } from '../../regions';
import { TradeStatus } from '../../../services/model';
import { SchedulerService, } from '../../../system';
import { OpenFin } from '../../../system/openFin';
import { getPopoutService } from '../../common/popout/';

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 4000;
const MAX_NOTIONAL_VALUE = 1000000000;

import {
  GetSpotStreamRequest,
  SpotPrice,
  Direction,
  ExecuteTradeRequest,
  CurrencyPair,
  ExecuteTradeResponse,
  RegionSettings
} from '../../../services/model';
import { SpotTileView } from '../views';


@view(SpotTileView)
export default class SpotTileModel extends ModelBase {
  // non view state
  _pricingService:PricingService;
  _executionService:ExecutionService;
  _executionDisposable:Rx.SerialDisposable;
  _priceSubscriptionDisposable:Rx.SerialDisposable;
  _toastNotificationTimerDisposable:Rx.SerialDisposable;
  _log:logger.Logger;
  _regionManagerHelper:RegionManagerHelper;
  _openFin:OpenFin;
  _regionName:string;
  _regionSettings:RegionSettings;
  // React doesn't seem to pickup ES6 properties (last time I looked it seemed to be because Babel doesn't spit them out as enumerable)
  // So we're just exposing the state as fields.
  currencyPair:CurrencyPair;
  currentSpotPrice:SpotPrice;
  notification:NotificationBase;
  tileTitle:string;
  notional:number;
  pricingConnected:boolean;
  executionConnected:boolean;
  isTradeExecutionInFlight:boolean;
  isRunningInOpenFin:boolean;
  currencyChartIsOpening:boolean;

  constructor(modelId:string,
              currencyPair:CurrencyPair, // in a real system you'd take a specific state object, not just a piece of state (currencyPair) as we do here
              router:Router,
              pricingService:PricingService,
              executionService:ExecutionService,
              regionManager:RegionManager,
              schedulerService:SchedulerService,
              openFin:OpenFin) {
    super(modelId, router);
    this._log = logger.create(`${this.modelId}:${currencyPair.symbol}`);// can't change ccy pair in this demo app, so reasonable to use the symbol in the logger name
    this._pricingService = pricingService;
    this._executionService = executionService;
    this._regionManager = regionManager;
    this._schedulerService = schedulerService;
    this._openFin = openFin;
    this.currencyPair = currencyPair;
    this._executionDisposable = new Rx.SerialDisposable();
    this.addDisposable(this._executionDisposable);
    this._priceSubscriptionDisposable = new Rx.SerialDisposable();
    this._toastNotificationTimerDisposable = new Rx.SerialDisposable();
    this.addDisposable(this._priceSubscriptionDisposable);
    this.addDisposable(this._toastNotificationTimerDisposable);

    this.tileTitle = `${currencyPair.base} / ${currencyPair.terms}`;
    this.notification = null;
    this.notional = 1000000;
    this.maxNotional = MAX_NOTIONAL_VALUE;
    this.currentSpotPrice = null;
    this.currencyChartIsOpening = false;

    // If things get much messier we could look at introducing a state machine, but for now we really only have these 3 conditions to worry about
    this.pricingConnected = false;
    this.executionConnected = false;
    this.isTradeExecutionInFlight = false;
    this._regionName = RegionNames.workspace;
    this._regionSettings = new RegionSettings(`${this.currencyPair.symbol} Spot`, 370, 190);
    this._regionManagerHelper = new RegionManagerHelper(this._regionName, regionManager, this, this._regionSettings);
    this.isRunningInOpenFin = openFin.isRunningInOpenFin;
  }

  get hasNotification() {
    return this.notification !== null;
  }

  @observeEvent('init')
  _onInit() {
    this._log.info(`Cash tile starting for pair ${this.currencyPair.symbol}`);
    this._tileName = `${this.currencyPair.symbol} Spot`;
    this._popoutService = getPopoutService(this._openfin);
    this._subscribeToPriceStream();
    this._subscribeToConnectionStatus();
    this._subscribeToClosePositionRequests();
    this._regionManagerHelper.init();
  }

  @observeEvent('tileClosed')
  _onTileClosed() {
    this._log.info(`Cash tile closing`);
    this._regionManager.removeFromRegion(RegionNames.workspace, this);
  }

  @observeEvent('popOutTile')
  _onPopOutTile() {
    this._log.info(`Popping out tile`);
    this._regionManagerHelper.popout();
  }

  @observeEvent('undockTile')
  _onUndockTile() {
    this._log.info(`Undock tile`);
    this._popoutService.undockPopout(this._tileName);
  }

  @observeEvent('displayCurrencyChart')
  _onDisplayCurrencyChart(){
    this._log.info(`Display currency chart - ChartIQ`);
    this.currencyChartIsOpening = true;
    this._openFin.displayCurrencyChart(this.currencyPair.symbol)
      .then(() => this.currencyChartIsOpening = false, () => this.currencyChartIsOpening = false);
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
    if (this.pricingConnected && this.executionConnected && !this.isTradeExecutionInFlight) {
      // stop the price stream so the users can see what the traded
      let request = this._createTradeRequest(e.direction, this.notional);
      this._log.info(`Will execute ${request.toString()}`);
      this.isTradeExecutionInFlight = true;

      this._executionDisposable.setDisposable(
        this._executionService.executeTrade(request)
         .subscribeWithRouter(
            this.router,
            this.modelId,
            (response:ExecuteTradeResponse) => {
              this.isTradeExecutionInFlight = false;
              this.notification = response.hasError
                ? TradeExecutionNotification.createForError(response.error)
                : TradeExecutionNotification.createForSuccess(response.trade);
              if (!response.hasError && response.trade.status === TradeStatus.Done) {
                this._toastNotificationTimerDisposable.setDisposable(
                  this._schedulerService.async.scheduleFuture('', DISMISS_NOTIFICATION_AFTER_X_IN_MS, () => this.router.publishEvent(this.modelId, 'tradeNotificationDismissed', {}))
                );
              }
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

  _subscribeToClosePositionRequests(){
    this._openFin.addSubscription('close-position', (msg, uuid) => this._closePositionRequestCallback( msg, uuid));
  }

  _closePositionRequestCallback(msg, uuid){
    if (msg.symbol !== this.currencyPair.symbol) return;
    let direction = msg.amount > 0 ? Direction.Sell : Direction.Buy;
    let request = this._createTradeRequest(direction, Math.abs(msg.amount));

    this._executionDisposable.setDisposable(
      this._executionService.executeTrade(request)
        .subscribeWithRouter(
          this.router,
          this.modelId,
          (response:ExecuteTradeResponse) => {
            this._openFin.sendPositionClosedNotification(uuid, msg.correlationId);
          },
          err => {
            this._log.error(`failed to close position ${err}`, err);
            fin.desktop.InterApplicationBus.send(uuid, msg.correlationId);
          })
    );
  }

  _createTradeRequest(direction:Direction, notional:number) {
    var spotRate = direction == Direction.Buy
      ? this.currentSpotPrice.ask.rawRate
      : this.currentSpotPrice.bid.rawRate;
    var dealtCurrency = direction == Direction.Buy ? this.currencyPair.base : this.currencyPair.terms;
    return new ExecuteTradeRequest(
      this.currencyPair.symbol,
      spotRate,
      direction.name,
      notional,
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
            this._openFin.publishPrice(price);
            // we don't update the price if we have an inflight trade, the users will want to see what they are buying
            if(!this.isTradeExecutionInFlight) {
              this.currentSpotPrice = price;
            }
          },
          err => {
            this._log.error('Error on getSpotPriceStream stream stream', err);
          }
        )
    );
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
