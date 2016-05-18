import Rx from 'rx';
import _ from 'lodash';
import { Trade, TradeNotification } from '../../services/model';
import { logger } from '../';

const _log:logger.Logger = logger.create('OpenFin');

export default class OpenFin {

  tradeClickedSubject:Rx.Subject<string>;
  limitCheckSubscriber:string;
  requestLimitCheckTopic:string;
  limitCheckId:number;

  constructor() {
    this.tradeClickedSubject = new Rx.Subject();
    this.limitCheckId = 1;
    this.requestLimitCheckTopic = 'request-limit-check';
  }

  get isRunningInOpenFin() {
    return typeof fin !== 'undefined';
  }

  close(window = this._currentWindow){
    window.close(true, () => _log.info('Window closed with success.'), err => _log.error('Failed to close window.', err));
  }

  minimize(window = this._currentWindow){
   window.minimize(() => _log.info('Window minimized with success.'), err => _log.error('Failed to minimize window.', err));
  }

  maximize(window = this._currentWindow){
    window.getState(state => {
        switch (state){
          case 'maximized':
          case 'restored':
          case 'minimized':
            window.restore(() => window.bringToFront());
            break;
          default:
            window.maximize(() => _log.info('Window maximized with success.'), err => _log.error('Failed to maximize window.', err));
        }
      });
  }

  checkLimit(executablePrice, notional:number, tradedCurrencyPair:string):Rx.Observable<boolean> {
    return Rx.Observable.create(observer => {
        let disposables = new Rx.CompositeDisposable();
        if (!this.available || this.limitCheckSubscriber == null) {
          _log.debug('client side limit check not up, will delegate to to server');
          observer.onNext(true);
          observer.onCompleted();
        } else {
          _log.debug(`checking if limit is ok with ${this.limitCheckSubscriber}`);
          var topic = 'limit-check-response' + (this.limitCheckId++);
          var limitCheckResponse:(msg:any) => void = (msg) => {
            _log.debug(`${this.limitCheckSubscriber} limit check response was ${msg}`);
            observer.onNext(msg.result);
            observer.onCompleted();
          };

          fin.desktop.InterApplicationBus.subscribe(this.limitCheckSubscriber, topic, limitCheckResponse);

          fin.desktop.InterApplicationBus.send(this.limitCheckSubscriber, this.requestLimitCheckTopic, {
            id: this.limitCheckId,
            responseTopic: topic,
            tradedCurrencyPair: tradedCurrencyPair,
            notional: notional,
            rate: executablePrice.rate
          });

          disposables.add(Rx.Disposable.create(() => {
            fin.desktop.InterApplicationBus.unsubscribe(this.limitCheckSubscriber, topic, limitCheckResponse);
          }));
        }
        return disposables;
      });
  }

  get _currentWindow() {
    return fin.desktop.Window.getCurrent();
  }

  displayCurrencyChart(symbol){
    let chartIqAppId = 'ChartIQ';
    fin.desktop.System.getAllApplications((apps) => {
      let chartIqApp = _.find(apps, ((app) => {
        return app.isRunning && app.uuid === chartIqAppId;
      }));
      if(chartIqApp) {
        this._refreshCurrencyChart(symbol);
      } else {
        this._launchCurrencyChart(symbol);
      }
    });
  }

  _refreshCurrencyChart(symbol){
    let interval = 5;
    let chartIqAppId = 'ChartIQ';
    fin.desktop.InterApplicationBus.publish('chartiq:main:change_symbol', { symbol: symbol, interval: interval });
  }

  _launchCurrencyChart(symbol){
    let interval = 5;
    let chartIqAppId = 'ChartIQ';
    let url = `http://openfin.chartiq.com/0.5/chartiq-shim.html?symbol=${symbol}&period=${interval}`;
    let name = `chartiq_${(new Date()).getTime()}`;
    const applicationIcon = 'http://openfin.chartiq.com/0.5/img/openfin-logo.png';
    let app = new fin.desktop.Application({
      uuid: chartIqAppId,
      url: url,
      name: name,
      applicationIcon: applicationIcon,
      mainWindowOptions:{
        autoShow: false
      }
    }, function(){
      app.run();
    });
  }

  openTradeNotification(trade:Trade): void {
    if (!this.isRunningInOpenFin) return;

    let tradeNotification = new TradeNotification(trade);

    let notification = new fin.desktop.Notification({
      url: '/notification.html',
      message: tradeNotification,
      onMessage: () => {
        this.maximise();
      }
    });
  }
}
