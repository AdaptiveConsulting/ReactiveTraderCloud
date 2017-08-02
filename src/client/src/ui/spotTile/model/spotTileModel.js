import { Observable, Subscription } from 'rxjs/Rx';
import { observeEvent } from 'esp-js';
import { viewBinding } from 'esp-js-react';
import logger from '../../../system/logger';
import { Environment } from '../../../system/';
import { ModelBase, RegionManagerHelper } from '../../common';
import { TradeExecutionNotification, TextNotification, NotificationType } from './';
import { RegionNames, view  } from '../../regions';
import { TradeStatus } from '../../../services/model';
import { getPopoutService } from '../../common/popout/';
import {
  GetSpotStreamRequest,
  Direction,
  ExecuteTradeRequest,
  RegionSettings
} from '../../../services/model';
import { SpotTileView } from '../views';

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 4000;
const MAX_NOTIONAL_VALUE = 1000000000;
const PRICE_STALE_AFTER_X_IN_MS = 6000;

@viewBinding(SpotTileView)
export default class SpotTileModel extends ModelBase {
  // non view state
  _pricingService;
  _executionService;
  _executionDisposable;
  _priceSubscriptionDisposable;
  _toastNotificationTimerDisposable;
  _log;
  _regionManagerHelper;
  _openFin;
  _regionName;
  _regionSettings;
  // React doesn't seem to pickup ES6 properties (last time I looked it seemed to be because Babel doesn't spit them out as enumerable)
  // So we're just exposing the state as fields.
  currencyPair;
  currentSpotPrice;
  notification;
  tileTitle;
  notional;
  pricingConnected;
  executionConnected;
  priceStale;
  isTradeExecutionInFlight;
  isRunningInOpenFin;
  currencyChartIsOpening;

  constructor(modelId,
              currencyPair, // in a real system you'd take a specific state object, not just a piece of state (currencyPair) as we do here
              router,
              pricingService,
              executionService,
              regionManager,
              schedulerService,
              openFin) {
    super(modelId, router);
    this._log = logger.create(`${this.modelId}:${currencyPair.symbol}`);// can't change ccy pair in this demo app, so reasonable to use the symbol in the logger name
    this._pricingService = pricingService;
    this._executionService = executionService;
    this._regionManager = regionManager;
    this._schedulerService = schedulerService;
    this._openFin = openFin;
    this.currencyPair = currencyPair;
    this._executionDisposable = new Subscription();
    this.addDisposable(this._executionDisposable);
    this._priceSubscriptionDisposable = new Subscription();
    this._toastNotificationTimerDisposable = new Subscription();
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
    this.priceStale = false;
    this.isTradeExecutionInFlight = false;
    this._regionName = RegionNames.workspace;
    this._regionSettings = new RegionSettings(`${this.currencyPair.symbol} Spot`, 370, 155, true);
    this._regionManagerHelper = new RegionManagerHelper(this._regionName, regionManager, this, this._regionSettings);
    this.isRunningInOpenFin = openFin.isRunningInOpenFin;
  }

  get hasNotification() {
    return this.notification !== null;
  }

  get canPopout() {
    return Environment.isRunningInIE;
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
  _onNotionalChanged(e) {
    this._log.info(`Updating notional to ${e.notional}`);
    this.notional = e.notional;
  }

  @observeEvent('executeTrade')
  _onExecuteTrade(e) {
    if (this.pricingConnected && this.executionConnected && !this.isTradeExecutionInFlight) {
      // stop the price stream so the users can see what the traded
      let request = this._createTradeRequest(e.direction, this.notional);
      this._log.info(`Will execute ${request.toString()}`);
      this.isTradeExecutionInFlight = true;

      this._executionDisposable.add(
        this._executionService.executeTrade(request)
         .subscribeWithRouter(
            this.router,
            this.modelId,
            (response) => {
              this.isTradeExecutionInFlight = false;
              this.notification = response.hasError
                ? TradeExecutionNotification.createForError(response.error)
                : TradeExecutionNotification.createForSuccess(response.trade);
              if (!response.hasError && response.trade.status === TradeStatus.Done) {
                this._toastNotificationTimerDisposable.add(
                  this._schedulerService.async.schedule(() => this.router.publishEvent(this.modelId, 'tradeNotificationDismissed', {}), DISMISS_NOTIFICATION_AFTER_X_IN_MS, '')
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

    this._executionDisposable.add(
      this._executionService.executeTrade(request)
        .subscribeWithRouter(
          this.router,
          this.modelId,
          (response) => {
            this._openFin.sendPositionClosedNotification(uuid, msg.correlationId);
          },
          err => {
            this._log.error(`failed to close position ${err}`, err);
            fin.desktop.InterApplicationBus.send(uuid, msg.correlationId);
          })
    );
  }

  _createTradeRequest(direction, notional) {
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
    let priceStream = this._pricingService
      .getSpotPriceStream(new GetSpotStreamRequest(this.currencyPair.symbol))
      .publish()
      .refCount();
    this._priceSubscriptionDisposable.add(
      priceStream
        .debounce(() => Observable.interval(PRICE_STALE_AFTER_X_IN_MS))
        .do(() => this._log.warn(`Price stale for ${this.currencyPair.symbol}`))
        .subscribeWithRouter(
          this.router,
          this.modelId,
          (price) => {
            this.priceStale = true;
            this._updatePricingDownStatusNotification();
          }),
      priceStream
        .subscribeWithRouter(
          this.router,
          this.modelId,
          (price) => {
            this._openFin.publishPrice(price);
            // we don't update the price if we have an inflight trade, the users will want to see what they are buying
            if(!this.isTradeExecutionInFlight) {
              this.currentSpotPrice = price;
            }
            if (this.priceStale) {
              this.priceStale = false;
              this._updatePricingDownStatusNotification();
            }
          },
          err => {
            this._log.error('Error on getSpotPriceStream stream stream', err);
          }
        )
    );
  }

  _subscribeToConnectionStatus() {
    let serviceStatusStream = Observable.combineLatest(
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
        (tuple) => {
          this.pricingConnected = tuple.pricingConnected;
          this.executionConnected = tuple.executionConnected;
          this._updatePricingDownStatusNotification();
        })
    );
  }

  _updatePricingDownStatusNotification() {
    if(this.notification === null || this.notification.notificationType === NotificationType.Text) {
        if (this.pricingConnected && !this.priceStale) {
          this.notification = null;
        } else {
          this.notification = new TextNotification('Pricing is unavailable');
        }
    }
  }
}
