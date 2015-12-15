import autobahn from 'autobahn';
import Rx from 'rx';

// AutobahnSessionProxy: makes the authbahn api more explicit, aids testing
class AutobahnSessionProxy {
    _session : autobahn.Session;
    constructor(session : autobahn.Session) {
        this._session = session;
    }
    subscribe<TRequest, TResults>(topic: String, onResults : (r: TResults) => void) : Promise {
        return this._session.subscribe(topic, onResults);
    }
    unsubscribe<TRequest, TResults>(subscription: autobahn.Subscription) : Promise {
        return this._session.unsubscribe(subscription);
    }
    call<TRequest, TResults>(operationName: String, payload : TRequest) : Promise {
        return this._session.call(operationName, payload);
    }
}
// AutobahnProxy: makes the authbahn api more explicit, aids testing
export default class AutobahnConnectionProxy {
    session: AutobahnSessionProxy;
    connection : autobahn.Connection;
    constructor(url : string, realm : string){
        this.connection = new autobahn.Connection({
            url : url,
            realm : realm,
            use_es6_promises: true,
            max_retries: -1 // unlimited retries
        });
    }
    open() {
        var _this = this;
        this.connection.onopen = session => {
            _this.session = new AutobahnSessionProxy(session);
            if (_this._onopen) {
                _this._onopen(session);
            }
        };
        this.connection.onclose = (reason : string, details : { reason : string, message : string }) => {
            if (_this._onclose) {
                _this._onclose(reason, details);
            };
        };
        this.connection.open();
    }
    onopen(callback:(session: autobahn.Session) => void) {
        this._onopen = callback;
    }
    onclose(callback :(reason : string, details : { reason : string, message : string }) => void) {
        this._onclose = callback;
    }
}
