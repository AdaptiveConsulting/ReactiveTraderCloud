import { Session, Subscription } from 'autobahn'

/**
 * AutobahnSessionProxy: makes the autobahn session api more explicit, aids testing
 */
export default class AutobahnSessionProxy {
  readonly session: Session

  constructor(session: Session) {
    this.session = session
  }

  subscribe<T>(topic: string, onResults: (r: T[]) => void) {
    return this.session.subscribe(topic, onResults)
  }

  unsubscribe(subscription: Subscription) {
    return this.session.unsubscribe(subscription)
  }

  call<T>(operationName: string, payload: any) {
    return this.session.call<T>(operationName, payload)
  }
}
