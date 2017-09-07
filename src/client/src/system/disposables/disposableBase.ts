import { Subscription } from 'rxjs/Rx'

export default class DisposableBase {
  disposables
  constructor() {
    this.disposables = new Subscription()
  }

  get isDisposed() {
    return this.disposables.isDisposed
  }

  addDisposable(disposable) {
    // esp-js is expecting a dispose method
    const prevProto = Object.getPrototypeOf(disposable)
    prevProto.dispose = prevProto.unsubscribe
    this.disposables.add(disposable)
  }

  dispose() {
    this.disposables.unsubscribe()
  }
}
