import { Subscription } from 'rxjs/Rx'

export default class DisposableBase {
  disposables: any
  constructor() {
    this.disposables = new Subscription()
  }
  get isDisposed() {
    return this.disposables.isDisposed
  }
  addDisposable (disposable) {
    this.disposables.add(disposable)
  }
  dispose () {
    this.disposables.dispose()
  }
}
