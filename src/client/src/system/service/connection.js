import Rx from 'rx';
import logger from '../logger';
import disposables from '../disposables';
import AutobahnProxy from './autobahnProxy';
import ServiceInstanceStatus from './serviceInstanceStatus';

var _log : logger.Logger = logger.create('Connection');

export default class Connection extends disposables.DisposableBase {
    _autobahn : AutobahnProxy;
    _connectionStatusSubject : Rx.BehaviorSubject<Boolean>;
    _serviceStatusSubject : Rx.BehaviorSubject<ServiceInstanceStatus>;
    _openCalled : Boolean;

    constructor(autobahn: AutobahnProxy){
        super();
        this._autobahn = autobahn;
        this._connectionStatusSubject = new Rx.BehaviorSubject(false);
        this._serviceStatusSubject = new Rx.Subject(false);
        this._openCalled = false;
        this._isConnected = false;
    }
    get connectionStatusStream() : Rx.Observable<Boolean> {
        return this._connectionStatusSubject
            .distinctUntilChanged()
            .asObservable();
    }
    get isConnected() : Boolean {
        return this._isConnected;
    }
    open() {
        if(!this._openCalled) {
            this._openCalled = true;
            _log.info('Opening connection');
            this._autobahn.onopen(session => {
                _log.info('Connected');
                this._isConnected = true;
                this._connectionStatusSubject.onNext(true);
                this.session = session;
            });
            this._autobahn.onclose((reason, details) => {
                _log.error('connection lost, reason [{0}]', reason);
                this._isConnected = false;
                this._connectionStatusSubject.onNext(false);
            });
            this._autobahn.open();
        }
    }
    getTopicStream<T>(topic:string) : Rx.Observable<T> {
        let _this = this;
        return Rx.Observable.create((o : Rx.Observer<T>) => {
            let disposables = new Rx.CompositeDisposable();
            _log.debug('Requesting topic [{0}]. Is connected [{1}]', topic, this._isConnected);
            if(this.isConnected) {
                var subscription;
                _this._autobahn.session.subscribe(topic, response => {
                    _log.debug('Received response on topic [{0}]', topic);
                    if(_log.isVerboseEnabled) {
                        _log.verbose('Received response on topic [{0}]. Payload[{1}]', topic, JSON.stringify(response[0]));
                    }
                    _log.debug('Received response on topic [{0}]', topic);
                    o.onNext(response[0]);
                }).then((sub : autobahn.Subscription) =>{
                    // subscription succeeded, subscription is an instance of autobahn.Subscription
                    _log.debug('subscription acked on topic [{0}]', topic);
                    subscription = sub;
                }, (error : autobahn.Error)=> {
                    // subscription failed, error is an instance of autobahn.Error
                    _log.error('Error on topic {0}: {1}', topic, error);
                });
                disposables.add(Rx.Disposable.create(() => {
                    _this._autobahn.session.unsubscribe(subscription).then(
                        gone => {
                            _log.debug('Successfully unsubscribing from topic {0}', topic);
                        },
                        error => {
                            _log.error('Error unsubscribing from topic {0}: {1}', topic, error);
                        }
                    );
                }));
            }
            else {
                o.onError(new Error('Session not connected'));
            }
            return disposables;
        });
    }
}
