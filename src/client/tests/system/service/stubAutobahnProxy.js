import _ from 'lodash';

export default class StubAutobahnProxy {
    constructor(){
        this.onOpenCallbacks = [];
        this.onCloseCallbacks = [];
        this.openCallCount = 0;
        this.session = new StubAutobahnSession();
    }
    open() {
        this.openCallCount++;
    }
    onopen(callback) {
        this.onOpenCallbacks.push(callback);
    }
    onclose(callback) {
        this.onCloseCallbacks.push(callback);
    }
    setIsConnected(isConnected) {
        if(isConnected) {
            _.forEach(this.onOpenCallbacks, onOpen => onOpen());
        } else {
            _.forEach(this.onCloseCallbacks, onClose => onClose());
        }
    }
}

class StubAutobahnSession {
    constructor() {
        this._stubPromises = {};
    }
    subscribe<TRequest, TResults>(topic:String, onResults:(r:TResults) => void): Promise {
        var stubPromise = new StubSubscribeResult(onResults);
        if (!this._stubPromises[topic]) {
            this._stubPromises[topic] = [];
        }
        this._stubPromises[topic].push(stubPromise)
        return stubPromise.underlyingPromise;
    }
    unsubscribe() {
        return new Promise();
    }
    call<TRequest, TResults>(operationName:String):Promise {
        var stubPromise = new StubPromiseResult();
        if (!this._stubPromises[operationName]) {
            this._stubPromises[operationName] = [];
        }
        this._stubPromises[operationName].push(stubPromise)
        return stubPromise.underlyingPromise;
    }
    getTopic(name : String, requestIndex : Number = 0) {
        if(!this._stubPromises[name]) {
            throw new Error('Nothing has subscribed to topic/operation [' + name +']');
        }
        // if there are multiple request to the same topic, this stub will the response StubPromiseResult into an array against the queue name, hence the index
        return this._stubPromises[name][requestIndex];
    }
}

class StubPromiseResult {
    constructor() {
        this._underlyingPromise = new Promise((onSuccess, onReject) => {
            this._onSuccess = onSuccess;
            this._onReject = onReject;
        })
    }
    get underlyingPromise() {
        return this._underlyingPromise;
    }
    get onSuccess() {
        return this._onSuccess;
    }
    get onReject() {
        return this._onReject;
    }
}

class StubSubscribeResult extends StubPromiseResult {
    constructor(onResults : (r: TResults) => void) {
        super()
        this._onResults = onResults;
    }
    onResults(payload : Object) {
        // autobahn returns results in an array, fake this up:
        return this._onResults([payload]);
    }
}

