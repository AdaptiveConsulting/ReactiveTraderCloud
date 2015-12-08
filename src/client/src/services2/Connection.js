import Rx from 'rx';
import system from 'system';
import autobahn from 'autobahn';
import model from './model';

var _log : system.logger.Logger = system.logger.create('Connection');

export default class Connection extends system.disposables.DisposableBase {

    _url : string;
    _realm : string;
    _connectionStatusSubject : Rx.BehaviorSubject<Boolean>;

    constructor(url : string, realm : string){
        super();
        this._url = url;
        this._realm = realm;
        this._connectionStatusSubject = new Rx.BehaviorSubject(false);
    }

    get connectionStatus() : rx.Observable<Boolean> {
        return this._connectionStatusSubject.asObservable();
    }

    connect() {
        this.connection = new autobahn.Connection({
            url : this._url,
            realm : this._realm,
            use_es6_promises: true,
            max_retries: -1 // unlimited retries
        });
        this.connection.onopen = session =>{
            this._connectionStatusSubject.onNext(true);
            this.session = session;
        };
        this.connection.onclose = () =>{
            this._connectionStatusSubject.onNext(false);
        };
        this.open();
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
