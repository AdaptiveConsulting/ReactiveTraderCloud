import Rx from 'rx';

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

  openNotification(type:string): void{

    console.log(' -- OPEN FIN --  should open notification , available : ', this.available);
    if (!this.available) return;

    let winShowHandler = () => {
      console.log(' notification from the winShowHandler : ');
      console.log(notification);
    };

    let notification = new fin.desktop.Notification({
      url: 'system/openFin/notification.html',
      message: 'new_message',
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
        let win = fin.desktop.Window.getCurrent();
        console.log(win);
        console.error(error);

      },
      onMessage: (msg:string) => {
        let win = fin.desktop.Window.getCurrent();
        console.log('--- let win ---');
        console.log(win);
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
      onShow: (e) => {

        winShowHandler();
        console.log('shown');
        let notif = fin.desktop.Notification.getCurrent();
        console.log(notif.width, notif.height);
        console.log(notif);
        console.log('e : ', e);
        console.log(notif.resizeTo);
        console.log('this', this);

        
      }
    });
    console.log(' open fin, new notification : ');
    console.log(notification);
    console.log(fin.desktop.Notification);
  }
}
