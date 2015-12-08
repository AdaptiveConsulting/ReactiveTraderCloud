import Rx from 'rx';
import system from 'system';
import model from './model';
import AutobahnProxy from './AutobahnProxy';

var _log : system.logger.Logger = system.logger.create('Connection');

export default class Connection extends system.disposables.DisposableBase {
    _autobahn : AutobahnProxy;
    _connectionStatusSubject : Rx.BehaviorSubject<Boolean>;
    constructor(autobahn: AutobahnProxy){
        super();
        this._autobahn = autobahn;
        this._connectionStatusSubject = new Rx.BehaviorSubject(false);
    }
    get connectionStatus() : rx.Observable<Boolean> {
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
        return rx.Observable.create((o : Rx.Observer<T>) => {
            var subscription : autobahn.Subscription;
            this.session.subscribe(topic, response => {
                o.onNext(response[0]);
            }).then((sub : autobahn.Subscription) =>{
                // subscription succeeded, subscription is an instance of autobahn.Subscription
                subscription = sub;
            }, (error : autobahn.Error)=> {
                // subscription failed, error is an instance of autobahn.Error
                _log.error('Error on topic {0}: {1}', topic, error);
            });
            return () => {
                this.session.unsubscribe(subscription).then(
                    function (gone) {
                        _log.debug('Successfully unsubscribing from topic {0}', topic);
                    },
                    function (error) {
                        _log.error('Error unsubscribing from topic {0}: {1}', topic, error);
                    }
                );
            }
        });
    }
}
