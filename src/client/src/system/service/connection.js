import Guard from '../guard';
import Rx from 'rx';
import logger from '../logger';
import disposables from '../disposables';
import AutobahnConnectionProxy from './autobahnConnectionProxy';
import ServiceInstanceStatus from './serviceInstanceStatus';

var _log : logger.Logger = logger.create('Connection');

export default class Connection extends disposables.DisposableBase {
    _autobahn : AutobahnProxy;
    _connectionStatusSubject : Rx.BehaviorSubject<Boolean>;
    _serviceStatusSubject : Rx.BehaviorSubject<ServiceInstanceStatus>;
    _openCalled : Boolean;
    constructor(autobahn: AutobahnProxy){
        super();
        Guard.isDefined(autobahn, 'autobahn required');
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
    // get an observable subscription to a well known stream, e.g. 'status'
    getWellKnownStream<TResponse>(topic:string) : Rx.Observable<TResponse> {
        let _this = this;
        return Rx.Observable.create((o : Rx.Observer<TResponse>) => {
            let disposables = new Rx.CompositeDisposable();
            _log.debug('Wiring up to topic [{0}]. Is connected [{1}]', topic, _this._isConnected);
            if(_this.isConnected) {
                var subscription;
                _this._autobahn.session.subscribe(topic, response => {
                    if(_log.isVerboseEnabled) {
                        _log.verbose('Received response on topic [{0}]. Payload[{1}]', topic, JSON.stringify(response[0]));
                    }
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
                o.onError(new Error('Session not connected, can\'t subscribe to topic [' + topic + ']'));
            }
            return disposables;
        });
    }
    // creates an topic unique to the operation, wraps it up as an observable stream, then does an RPC to instruct the server to publish to said stream
    getUniqueStream<TResponse>(operationName:string) : Rx.Observable<TResponse> {
        let _this = this;
        return Rx.Observable.create((o : Rx.Observer<TResponse>) => {
            let disposables = new Rx.CompositeDisposable();

            return disposables;
        });
    }
    // wraps a RPC up as an observable stream
    requestResponse<TRequest, TResponse>(operationName: String, payload : TResponse) : Rx.Observable<TResponse> {
        let _this = this;
        return Rx.Observable.create((o : Rx.Observer<TResponse>) => {
            _log.debug('Requesting a response for operation [{0}]. Is connected [{1}]', operationName, _this._isConnected);
            if (_this.isConnected) {
                var isDisposed:Boolean
                _this._autobahn.call(operationName, payload).then(
                    result => {
                        if (!isDisposed) {
                            o.onNext(result);
                        } else {
                            _log.warn('Ignoring response for operation [{0}] as stream disposed', operationName);
                        }
                    },
                    error => {
                        if (!isDisposed) {
                            o.onError(error);
                        } else {
                            _log.error('Ignoring error for operation [{0}] as stream disposed.. Error was: [{1}]', operationName, error);
                        }
                    }
                );
                disposables.add(Rx.Disposable.create(() => {
                    isDisposed = true;
                }));
            }
            else {
                o.onError(new Error('Session not connected, can\'t perform operation ' + operationName));
            }
            return disposables;
        });
    }
}
