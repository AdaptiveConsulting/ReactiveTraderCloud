import Rx from 'rx';
import system from 'system';
import model from './model';
import AutobahnProxy from './autobahnProxy';

var _log : system.logger.Logger = system.logger.create('Connection');

export default class Connection extends system.disposables.DisposableBase {
    _autobahn : AutobahnProxy;
    _connectionStatusSubject : Rx.BehaviorSubject<Boolean>;
    _serviceStatusSubject : Rx.BehaviorSubject<model.ServiceInstanceStatus>;
    constructor(autobahn: AutobahnProxy){
        super();
        this._autobahn = autobahn;
        this._connectionStatusSubject = new Rx.BehaviorSubject(false);
        this._serviceStatusSubject = new Rx.Subject(false);
    }
    get connectionStatus() : Rx.Observable<Boolean> {
        return this._connectionStatusSubject
            .distinctUntilChanged()
            .asObservable();
    }
    open() {
        _log.info('Opening connection');
        this._autobahn.onopen(session =>{
            _log.info('Connected');
            this._connectionStatusSubject.onNext(true);
            this.session = session;
        });
        this._autobahn.onclose((reason, details) => {
            _log.error('connection lost, reason [{0}]', reason);
            this._connectionStatusSubject.onNext(false);
        });
        this._autobahn.open();
    }
    getTopicStream<T>(topic:string) : Rx.Observable<T> {
        let _this = this;
        return Rx.Observable.create((o : Rx.Observer<T>) => {
            _log.debug('Requesting topic [{0}]', topic);
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
            return () => {
                _this._autobahn.session.unsubscribe(subscription).then(
                    gone => {
                        _log.debug('Successfully unsubscribing from topic {0}', topic);
                    },
                    error => {
                        _log.error('Error unsubscribing from topic {0}: {1}', topic, error);
                    }
                );
            }
        });
    }
}
