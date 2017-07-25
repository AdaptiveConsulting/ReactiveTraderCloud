import Rx from 'rx';
import _ from 'lodash';
import { TradeNotification } from '../../services/model';
import PriceMapper from '../../services/mappers/priceMapper';
import PositionsMapper from '../../services/mappers/positionsMapper';
import logger from '../logger';
import { WellKnownModelIds } from '../../';

var _log = logger.create('OpenFin');

const REQUEST_LIMIT_CHECK_TOPIC = 'request-limit-check';

export default class OpenFin {

  tradeClickedSubject;
  limitCheckSubscriber;
  limitCheckId;
  _router;

  constructor(router) {
    this.tradeClickedSubject = new Rx.Subject();
    this.limitCheckId = 1;
    this.limitCheckSubscriber = null;
    this._router = router;
    if (this.isRunningInOpenFin) {
      this._initializeLimitChecker();
    }
  }

  get isRunningInOpenFin() {
    return typeof fin !== 'undefined';
  }

  close(currentWindow = this._currentWindow){
    currentWindow.close(true, () => _log.info('Window closed with success.'), err => _log.error('Failed to close window.', err));
  }

  minimize(currentWindow = this._currentWindow){
    currentWindow.minimize(() => _log.info('Window minimized with success.'), err => _log.error('Failed to minimize window.', err));
  }

  maximize(currentWindow = this._currentWindow){
    currentWindow.getState(state => {
        switch (state){
          case 'maximized':
          case 'restored':
          case 'minimized':
            currentWindow.restore(() => currentWindow.bringToFront(
              () => _log.info('Window brought to front.'),
              err => _log.error(err)
            ), err => _log.error(err));
            break;
          default:
            currentWindow.maximize(() => _log.info('Window maximized with success.'), err => _log.error('Failed to maximize window.', err));
        }
      });
  }

  bringToFront(currentWindow = this._currentWindow){
    currentWindow.getState(state => {
      if (state === 'minimized'){
        currentWindow.restore(() => currentWindow.bringToFront(
          () => _log.info('Window brought to front.'),
          err => _log.error(err)
        ), err => _log.error(err));
      }else{
        currentWindow.bringToFront(
          () => _log.info('Window brought to front.'),
          err => _log.error(err));
      }
    });
  }

  addSubscription(name, callback){
    if (!this.isRunningInOpenFin) return;
    if (!fin.desktop.InterApplicationBus){
      fin.desktop.main(() => {
        fin.desktop.InterApplicationBus.subscribe('*', name, (msg, uuid) => {
          callback.call(null, msg, uuid);
        });
      });
    }else{
      fin.desktop.InterApplicationBus.subscribe('*', name, (msg, uuid) => {
        callback.call(null, msg, uuid);
      });
    }
  }

  checkLimit(executablePrice, notional, tradedCurrencyPair) {
    let _this = this;
    return Rx.Observable.create(observer => {
        let disposables = new Rx.CompositeDisposable();
        if (_this.limitCheckSubscriber === null) {
          _log.debug('client side limit check not up, will delegate to to server');
          observer.onNext(true);
          observer.onCompleted();
        } else {
          _log.debug(`checking if limit is ok with ${_this.limitCheckSubscriber}`);
          const topic = `limit-check-response (${_this.limitCheckId++})`;
          let limitCheckResponse = (msg) => {
            _log.debug(`${_this.limitCheckSubscriber} limit check response was ${msg}`);
            observer.onNext(msg.result);
            observer.onCompleted();
          };

          fin.desktop.InterApplicationBus.subscribe(_this.limitCheckSubscriber, topic, limitCheckResponse);

          fin.desktop.InterApplicationBus.send(_this.limitCheckSubscriber, REQUEST_LIMIT_CHECK_TOPIC, {
            id: _this.limitCheckId,
            responseTopic: topic,
            tradedCurrencyPair: tradedCurrencyPair,
            notional: notional,
            rate: executablePrice
          });

          disposables.add(Rx.Disposable.create(() => {
            fin.desktop.InterApplicationBus.unsubscribe(_this.limitCheckSubscriber, topic, limitCheckResponse);
          }));
        }
        return disposables;
      });
  }

  get _currentWindow() {
    return fin.desktop.Window.getCurrent();
  }

  /**
   * Display External Chart
   * @param symbol
   * @returns {Promise|Promise<T>}
   */
  displayCurrencyChart(symbol){
    return new Promise((resolve, reject) => {
      let chartIqAppId = 'ChartIQ';
      fin.desktop.System.getAllApplications((apps) => {
        let chartIqApp = _.find(apps, ((app) => {
          return app.isRunning && app.uuid === chartIqAppId;
        }));
        if(chartIqApp) {
          resolve(this._refreshCurrencyChart(symbol));
        } else {
          resolve(this._launchCurrencyChart(symbol));
        }
      });
    });
  }

  /**
   * Initialize limit checker
   * @private
   */
  _initializeLimitChecker() {
    fin.desktop.main(() => {
      fin.desktop.InterApplicationBus.addSubscribeListener(function(uuid, topic) {
        if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
          _log.info(`${uuid} has subscribed as a limit checker`);
          // There will only be one. If there are more, last subscriber will be used
          this.limitCheckSubscriber = uuid;
        }
      }.bind(this));
      fin.desktop.InterApplicationBus.addUnsubscribeListener(function(uuid, topic) {
        if (topic === REQUEST_LIMIT_CHECK_TOPIC) {
          _log.info(`${uuid} has unsubscribed as a limit checker`);
          this.limitCheckSubscriber = null;
        }
      }.bind(this));
    });
  }

  /**
   *
   * @param symbol
   * @returns {Promise<void>|Promise.<T>|Promise<T>}
   * @private
   */
  _refreshCurrencyChart(symbol){
    let interval = 5;
    fin.desktop.InterApplicationBus.publish('chartiq:main:change_symbol', { symbol: symbol, interval: interval });
    return Promise.resolve();
  }

  /**
   * @param symbol
   * @returns {Promise<T>|Promise}
   * @private
   */
  _launchCurrencyChart(symbol) {
    return new Promise((resolve, reject) => {
      let interval = 5;
      let chartIqAppId = 'ChartIQ';
      let url = `http://adaptiveconsulting.github.io/ReactiveTraderCloud/chartiq/chartiq-shim.html?symbol=${symbol}&period=${interval}`;
      let name = `chartiq_${(new Date()).getTime()}`;
      const applicationIcon = 'http://adaptiveconsulting.github.io/chartiq/icon.png';
      let app = new fin.desktop.Application({
        uuid: chartIqAppId,
        url: url,
        name: name,
        applicationIcon: applicationIcon,
        mainWindowOptions:{
          autoShow: false
        }
      }, () => app.run(() => setTimeout(() => resolve(), 1000), err => reject(err)), err => reject(err));
    });
  }

  openTradeNotification(trade) {
    if (!this.isRunningInOpenFin) return;

    let tradeNotification = new TradeNotification(trade);
    let notification = new fin.desktop.Notification({
      url: '/notification.html',
      message: tradeNotification,
      onClick: () => {
        this.bringToFront();
        this._router.publishEvent(WellKnownModelIds.blotterModelId, 'highlightTradeRow', {trade});
      }
    });
    fin.desktop.InterApplicationBus.publish('blotter-new-item', tradeNotification);
  }

  publishCurrentPositions(ccyPairPositions) {
    if (!this.isRunningInOpenFin ) return;
    let serialisePositions = ccyPairPositions.map( p => PositionsMapper.mapToDto(p));
    fin.desktop.InterApplicationBus.publish('position-update', serialisePositions);
  }

  publishPrice(price) {
    if (!this.isRunningInOpenFin) return;
    fin.desktop.InterApplicationBus.publish('price-update', PriceMapper.mapToSpotPriceDto(price));
  }

  sendAllBlotterData(uuid, blotterData){
    fin.desktop.InterApplicationBus.send(uuid, 'blotter-data', blotterData);
  }

  sendPositionClosedNotification(uuid, correlationId){
    fin.desktop.InterApplicationBus.send(uuid, 'position-closed', correlationId);
  }

  openLink(url) {
    fin.desktop.System.openUrlWithBrowser(url);
  }
}
