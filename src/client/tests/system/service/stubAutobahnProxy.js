import _ from 'lodash';

export default class StubAutobahnProxy {
  constructor() {
    this.onOpenCallbacks = [];
    this.onCloseCallbacks = [];
    this.openCallCount = 0;
    this.closeCallCount = 0;
    this.session = new StubAutobahnSession();
  }

  open() {
    this.openCallCount++;
  }

  close() {
    this.closeCallCount++;
    _.forEach(this.onCloseCallbacks, onClose => onClose('closed'));
  }

  onopen(callback) {
    this.onOpenCallbacks.push(callback);
  }

  onclose(callback) {
    this.onCloseCallbacks.push(callback);
  }

  setIsConnected(isConnected) {
    if (isConnected) {
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

  subscribe<TRequest, TResults>(topic:String, onResults:(r:TResults) => void):Promise {
    var stubPromise = new StubSubscribeResult(onResults);
    // we only support one request for the given topic,
    // if there is anything there we just blow it away
    this._stubPromises[topic] = stubPromise;
    return stubPromise;
  }

  unsubscribe(subscription) {
    return new Promise((onSuccess, onReject) => {
      // noop for now
    })
  }

  call<TRequest, TResults>(operationName:String, dto:TRequest):DummyPromise {
    var stubPromise = new StubCallResult(dto);
    // we only support one request for the given topic,
    // if there is anything there we just blow it away
    this._stubPromises[operationName] = stubPromise;
    return stubPromise;
  }

  getTopic(name:String) {
    if (!this._stubPromises[name]) {
      throw new Error('Nothing has subscribed to topic/operation [' + name + ']');
    }
    return this._stubPromises[name];
  }
}

//class StubPromiseResult {
//    constructor() {
//        this._underlyingPromise = new Promise((onSuccess, onReject) => {
//            this._onSuccess = onSuccess;
//            this._onReject = onReject;
//        });
//    }
//    get underlyingPromise() {
//        return this._underlyingPromise;
//    }
//    get onSuccess() {
//        return this._onSuccess;
//    }
//    get onReject() {
//        return this._onReject;
//    }
//}

class DummyPromise {
  then(onSuccess, onReject) {
    this.onSuccess = onSuccess;
    this.onReject = onReject;
  }
}

class StubCallResult extends DummyPromise {
  constructor(dto:Object) {
    super();
    this._dto = dto;
  }

  get dto() {
    return this._dto[0];
  }
}

class StubSubscribeResult extends DummyPromise {
  constructor(onResults:(r:TResults) => void) {
    super();
    this._onResults = onResults;
  }

  onResults(payload:Object) {
    // autobahn returns results in an array, fake this up:
    return this._onResults([payload]);
  }
}


