import rx from 'rx';
import system from '../system';

class DisposableBase {
    constructor() {
        this._disposables = new rx.Disposable.CompositeDisposable();
    }
    get isDisposed() {
        return this._disposables.isDisposed;
    }
    addDisposable (disposable) {
        this._disposables.add(disposable);
    }
    dispose () {
        this._disposables.dispose();
    }
}
export default DisposableBase;
