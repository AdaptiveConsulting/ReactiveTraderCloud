import autobahn from 'autobahn';

/**
 * AutobahnSessionProxy: makes the autobahn session api more explicit, aids testing
 */
export default class AutobahnSessionProxy {

  constructor(session) {
    this._session = session;
  }

  subscribe(topic, onResults) {
    return this._session.subscribe(topic, onResults);
  }

  unsubscribe(subscription) {
    return this._session.unsubscribe(subscription);
  }

  call(operationName, payload) {
    return this._session.call(operationName, payload);
  }
}
