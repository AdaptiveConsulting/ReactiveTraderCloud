import Guard from '../guard';
import Rx from 'rx';
import logger from '../logger';
import disposables from '../disposables';
import AutobahnConnectionProxy from './autobahnConnectionProxy';
import ServiceInstanceStatus from './serviceInstanceStatus';

var _log:logger.Logger = logger.create('Connection');

/**
 * Represents a Connection to autobahn
 */
export default class Connection extends disposables.DisposableBase {
    _autobahn:AutobahnConnectionProxy;
    _connectionStatusSubject:Rx.BehaviorSubject<Boolean>;
    _serviceStatusSubject:Rx.BehaviorSubject<ServiceInstanceStatus>;
    _openCalled:Boolean;

    constructor(userName:string, autobahn:AutobahnConnectionProxy) {
        super();
        Guard.isDefined(autobahn, 'autobahn required');
        Guard.isString(userName, 'userName required');
        this._userName = userName;
        this._autobahn = autobahn;
        this._connectionStatusSubject = new Rx.BehaviorSubject(false);
        this._serviceStatusSubject = new Rx.BehaviorSubject(false);
        this._openCalled = false;
        this._isConnected = false;
    }

    get connectionStatusStream():Rx.Observable<Boolean> {
        return this._connectionStatusSubject
            .distinctUntilChanged()
            .asObservable();
    }

    get isConnected():Boolean {
        return this._isConnected;
    }

    connect() {
        if (!this._openCalled) {
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

    /**
     * Get an observable subscription to a well known stream, e.g. 'status'
     * @param topic
     * @returns {Observable}
     */
    subscribeToTopic<TResponse>(topic:string):Rx.Observable<TResponse> {
        let _this = this;
        return Rx.Observable.create((o:Rx.Observer<TResponse>) => {
            let disposables = new Rx.CompositeDisposable();
            _log.debug('Wiring up to topic [{0}]. Is connected [{1}]', topic, _this._isConnected);
            if (_this.isConnected) {
                var subscription;
                _this._autobahn.session.subscribe(topic, response => {
                    if (_log.isVerboseEnabled) {
                        _log.verbose('Received response on topic [{0}]. Payload[{1}]', topic, JSON.stringify(response[0]));
                    }
                    o.onNext(response[0]);
                }).then((sub:autobahn.Subscription) => {
                    // subscription succeeded, subscription is an instance of autobahn.Subscription
                    _log.debug('subscription acked on topic [{0}]', topic);
                    subscription = sub;
                }, (error:autobahn.Error) => {
                    // subscription failed, error is an instance of autobahn.Error
                    _log.error('Error on topic {0}: {1}', topic, error);
                    o.onError(error);
                });
                disposables.add(Rx.Disposable.create(() => {
                    if (subscription) {
                        try {
                            _this._autobahn.session.unsubscribe(subscription).then(
                                gone => {
                                    _log.debug('Successfully unsubscribing from topic {0}', topic);
                                },
                                error => {
                                    _log.error('Error unsubscribing from topic {0}: {1}', topic, error);
                                }
                            );
                        } catch (err) {
                            _log.error('Error thrown unsubscribing from topic {0}: {1}', topic, err);
                        }
                    }
                }));
            }
            else {
                o.onError(new Error('Session not connected, can\'t subscribe to topic [' + topic + ']'));
            }
            return disposables;
        });
    }

    /**
     * wraps a RPC up as an observable stream
     * @param remoteProcedure
     * @param payload
     * @param responseTopic
     * @returns {Observable}
     */
    requestResponse<TRequest, TResponse>(remoteProcedure:String, payload:TRequest, responseTopic:String = ''):Rx.Observable<TResponse> {
        let _this = this;
        return Rx.Observable.create((o:Rx.Observer<TResponse>) => {
            _log.debug('Requesting a response for remoteProcedure [{0}]. Is connected [{1}]', remoteProcedure, _this._isConnected);
            let disposables = new Rx.CompositeDisposable();
            if (_this.isConnected) {
                var isDisposed:Boolean
                var dto = [{
                    replyTo: responseTopic,
                    Username: _this._username,
                    payload: payload
                }];
                _this._autobahn.session.call(remoteProcedure, dto).then(
                    result => {
                        if (!isDisposed) {
                            o.onNext(result);
                            o.onCompleted();
                        } else {
                            _log.warn('Ignoring response for remoteProcedure [{0}] as stream disposed', remoteProcedure);
                        }
                    },
                    error => {
                        if (!isDisposed) {
                            o.onError(error);
                        } else {
                            _log.error('Ignoring error for remoteProcedure [{0}] as stream disposed.. Error was: [{1}]', remoteProcedure, error.error);
                        }
                    }
                );
                disposables.add(Rx.Disposable.create(() => {
                    isDisposed = true;
                }));
            }
            else {
                o.onError(new Error('Session not connected, can\'t perform remoteProcedure ' + remoteProcedure));
            }
            return disposables;
        });
    }
}
