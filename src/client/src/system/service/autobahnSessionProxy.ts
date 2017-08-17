import { Session, Subscription } from 'autobahn'

/**
 * AutobahnSessionProxy: makes the autobahn session api more explicit, aids testing
 */
export default class AutobahnSessionProxy {

  _session: Session

  constructor(session: Session) {
    this._session = session
  }

  subscribe(topic: string, onResults: (r) => void) {
    return this._session.subscribe(topic, onResults)
  }

  unsubscribe(subscription: Subscription) {
    return this._session.unsubscribe(subscription)
  }

  call(operationName: string, payload: any) {
    return this._session.call(operationName, payload)
  }
}
