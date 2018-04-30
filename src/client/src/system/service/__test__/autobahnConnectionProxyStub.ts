import { Connection } from 'autobahn'
import * as _ from 'lodash'
import { AutobahnConnection } from '../AutoBahnConnection'

export default class StubAutobahnProxy implements AutobahnConnection {
  onOpenCallbacks: any[]
  onCloseCallbacks: any[]
  openCallCount: number
  closeCallCount: number
  session: any
  connection: any

  constructor() {
    this.onOpenCallbacks = []
    this.onCloseCallbacks = []
    this.openCallCount = 0
    this.closeCallCount = 0
    this.session = new StubAutobahnSession()
    this.connection = {
      transport: {
        info: {
          url: ''
        }
      }
    }
  }

  open() {
    this.openCallCount++
    return true
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

  getConnection(): Connection {
    return this.connection
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
      throw new Error(
        'Nothing has subscribed to topic/operation [' + name + ']'
      )
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
  dtoInner

  constructor(dto) {
    super()
    this.dtoInner = dto
  }

  get dto() {
    return this.dtoInner[0]
  }
}

class StubSubscribeResult extends DummyPromise {
  onResultsCallback

  constructor(onResults) {
    super()
    this.onResultsCallback = onResults
  }

  onResults(payload) {
    // autobahn returns results in an array, fake this up:
    return this.onResultsCallback([payload])
  }
}
