import Rx from 'rx';

export default class OpenFin {

  available:boolean = false;
  //currentWindow:OpenFinWindow;

  //windows:Array<TearoutWindowInfo> = [];
  tradeClickedSubject:Rx.Subject<string>;
  //analyticsSubscription:Rx.IDisposable;
  // pricesSubscription:Rx.IDisposable;
  limitCheckSubscriber:string;
  requestLimitCheckTopic:string;
  limitCheckId:number = 1;

  constructor() {
    this.tradeClickedSubject = new Rx.Subject();
    if (typeof fin === 'undefined') return;

    this.available = true;
    this.limitCheckId = 1;
    this.requestLimitCheckTopic = 'request-limit-check';
    console.log('Application is running in OpenFin container');
    // this.setToolbarAsDraggable();
  }

  get isRunningInOpenFin() {
    return typeof fin !== 'undefined';
  }

  close(){
    this._currentWindow.close();
  }

  minimise(e){
    this._currentWindow.minimize();
  }

  maximise(e){
    let window = this._currentWindow;
    window.getState(state => {
        switch (state){
          case 'maximized':
          case 'restored':
          case 'minimized':
            window.restore(() => window.bringToFront());
            break;
          default:
            window.maximize();
        }
      });
  }

  checkLimit(executablePrice, notional:number, tradedCurrencyPair:string):Rx.Observable<boolean> {
    return Rx.Observable.create(observer => {
        let disposables = new Rx.CompositeDisposable();
        if (!this.available || this.limitCheckSubscriber == null) {
          console.log('client side limit check not up, will delegate to to server');
          observer.onNext(true);
          observer.onCompleted();
        } else {
          console.log('checking if limit is ok with ' + this.limitCheckSubscriber);
          var topic = 'limit-check-response' + (this.limitCheckId++);
          var limitCheckResponse:(msg:any) => void = (msg) => {
            console.log(this.limitCheckSubscriber + ' limit check response was ' + msg);
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
}
