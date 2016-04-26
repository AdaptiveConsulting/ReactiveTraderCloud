import Rx from 'rx';
import { Trade, TradeNotification } from '../../services/model';

export default class OpenFin {

  available:boolean = false;
  tradeClickedSubject:Rx.Subject<string>;
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

  openTradeNotification(trade:Trade): void{
    if (!this.available) return;

    let tradeNotification = new TradeNotification(trade);

    let notification = new fin.desktop.Notification({
      url: '/#notification',
      message: tradeNotification,
      onClick: () => {
        console.log('clicked');
      },
      onClose: () => {
        console.log('closed');
      },
      onDismiss: () => {
        console.log('dismissed');
      },
      onError: (error) => {
        console.error(error);
      },
      onMessage: (msg:any) => {
        let win = fin.desktop.Window.getCurrent();
        win.getState(state => {
          switch(state){

            case 'minimized':
                  console.log('switched state, minimized');
                  win.restore(() => win.bringToFront());
                  break;
            case 'maximized':
            case 'restored':
                  console.log(' on message switch state win : ', win);
                  win.bringToFront();
                  break;
          }
        });
      },
      onShow: () => {
        console.log('on show');
      }
    });
  }
}

