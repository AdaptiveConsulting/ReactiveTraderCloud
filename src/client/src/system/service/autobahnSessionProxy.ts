import { Session, Subscription } from 'autobahn'

/**
 * AutobahnSessionProxy: makes the autobahn session api more explicit, aids testing
 */
export default class AutobahnSessionProxy {

  session: Session

  constructor(session: Session) {
    this.session = session
  }

  subscribe(topic: string, onResults: (r) => void) {
    return this.session.subscribe(topic, onResults)
  }

  unsubscribe(subscription: Subscription) {
    return this.session.unsubscribe(subscription)
  }

  call(operationName: string, payload: any) {
    return this.session.call(operationName, payload)
  }
}
