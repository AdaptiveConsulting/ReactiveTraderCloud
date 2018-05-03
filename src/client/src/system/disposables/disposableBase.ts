import { Subscription } from 'rxjs'

export default class DisposableBase {
  disposables: Subscription
  constructor() {
    this.disposables = new Subscription()
  }

  get isDisposed() {
    return this.disposables.closed
  }

  addDisposable(disposable: Subscription) {
    this.disposables.add(disposable)
  }

  dispose() {
    this.disposables.unsubscribe()
  }
}
