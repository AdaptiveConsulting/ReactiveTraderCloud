import { Subscription } from 'rxjs/Rx'

export default class DisposableBase {
  _disposables: any
  constructor() {
    this._disposables = new Subscription()
  }
  get isDisposed() {
    return this._disposables.isDisposed
  }
  addDisposable (disposable) {
    this._disposables.add(disposable)
  }
  dispose () {
    this._disposables.dispose()
  }
}
