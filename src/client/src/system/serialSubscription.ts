import { Subscription } from 'rxjs/Rx'
import { TeardownLogic } from 'rxjs/src/Subscription'

/**
 * SerialSubscription for rxjs 5. Only for use with not yet refactored legacy SerialDisposable
 */
export class SerialSubscription extends Subscription {
  currentSubscription: Subscription | null
  constructor() {
    super()
    this.currentSubscription = Subscription.EMPTY
  }

  add(teardownSrc: TeardownLogic): Subscription {
    let teardown: any = teardownSrc
    if (this.closed) { return this }
    if (typeof(teardownSrc) === 'function') { teardown = new Subscription(teardown) }

    if (this.currentSubscription) {
      this.remove(this.currentSubscription)
      this.currentSubscription.unsubscribe()
      this.currentSubscription = null
    }

    super.add(this.currentSubscription = teardown)
    return this
  }
}
