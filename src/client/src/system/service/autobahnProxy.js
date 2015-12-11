import autobahn from 'autobahn';

export default class AutobahnProxy {
    session: autobahn.Session;
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
            _this.session = session;
            if (_this._onopen) _this._onopen(session);
        };
        this.connection.onclose = (reason : string, details : { reason : string, message : string }) => {
            if (_this._onclose) _this._onclose(reason, details);
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
