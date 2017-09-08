import * as _ from 'lodash'

export default class StubAutobahnProxy {
  onOpenCallbacks
  onCloseCallbacks
  openCallCount
  closeCallCount
  session
  connection
  constructor() {
    this.onOpenCallbacks = []
    this.onCloseCallbacks = []
    this.openCallCount = 0
    this.closeCallCount = 0
    this.session = new StubAutobahnSession()
    this.connection = {
      transport: {
        info: {
          url: '',
        },
      },
    }
  }

  open() {
    this.openCallCount++
  }

  close() {
    this.closeCallCount++
    _.forEach(this.onCloseCallbacks, onClose => onClose('closed'))
  }

  onopen(callback) {
    this.onOpenCallbacks.push(callback)
  }

  onclose(callback) {
    this.onCloseCallbacks.push(callback)
  }

  setIsConnected(isConnected) {
    if (isConnected) {
      _.forEach(this.onOpenCallbacks, onOpen => onOpen())
    } else {
      _.forEach(this.onCloseCallbacks, onClose => onClose())
    }
  }
}

class StubAutobahnSession {
  stubPromises
  constructor() {
    this.stubPromises = {}
  }

  subscribe(topic, onResults) {
    const stubPromise = new StubSubscribeResult(onResults)
    // we only support one request for the given topic,
    // if there is anything there we just blow it away
    this.stubPromises[topic] = stubPromise
    return stubPromise
  }

  unsubscribe(subscription) {
    return new Promise((onSuccess, onReject) => {
      // noop for now
    })
  }

  call(operationName, dto) {
    const stubPromise = new StubCallResult(dto)
    // we only support one request for the given topic,
    // if there is anything there we just blow it away
    this.stubPromises[operationName] = stubPromise
    return stubPromise
  }

  getTopic(name) {
    if (!this.stubPromises[name]) {
      throw new Error('Nothing has subscribed to topic/operation [' + name + ']')
    }
    return this.stubPromises[name]
  }
}

class DummyPromise {
  onSuccess
  onReject
  then(onSuccess, onReject) {
    this.onSuccess = onSuccess
    this.onReject = onReject
  }
}

class StubCallResult extends DummyPromise {
  _dto
  constructor(dto) {
    super()
    this._dto = dto
  }

  get dto() {
    return this._dto[0]
  }
}

class StubSubscribeResult extends DummyPromise {
  _onResults
  constructor(onResults) {
    super()
    this._onResults = onResults
  }

  onResults(payload) {
    // autobahn returns results in an array, fake this up:
    return this._onResults([payload])
  }
}


