import { Subscription } from 'rxjs/Rx'
import { TeardownLogic } from 'rxjs/src/Subscription'

/**
 * SerialSubscription for rxjs 5. Do not use
 */
export class SerialSubscription extends Subscription {
  _currentSubscription
  constructor() {
    super();
    this._currentSubscription = Subscription.EMPTY;
  }

  add(teardownSrc: TeardownLogic): Subscription {
    let teardown: any = teardownSrc
    if (this.closed) return this;
    if (typeof(teardownSrc) === 'function') teardown = new Subscription(teardown);

    if (this._currentSubscription) {
      this.remove(this._currentSubscription);
      this._currentSubscription.unsubscribe();
      this._currentSubscription = null;
    }

    super.add(this._currentSubscription = teardown);
    return this;
  }
}
