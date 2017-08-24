import { Subscription } from 'rxjs/Rx';


export default class DisposableBase {
  constructor() {
    this._disposables = new Subscription();
  }

  get isDisposed() {
    return this._disposables.isDisposed;
  }

  addDisposable(disposable) {
    // esp-js is expecting a dispose method
    let prevProto = Object.getPrototypeOf(disposable);
    prevProto.dispose = prevProto.unsubscribe;
    this._disposables.add(disposable);
  }

  dispose() {
    this._disposables.unsubscribe();
  }
}
