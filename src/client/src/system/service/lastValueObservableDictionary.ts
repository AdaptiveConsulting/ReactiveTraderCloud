import LastValueObservable from './lastValueObservable';

export default class LastValueObservableDictionary {

  constructor() {
    this._values = {};
    this._version = 0;
  }

  _values: any;

  get values() {
    return this._values;
  }

  _version: number;

  get version() {
    return this._version;
  }

  hasKey(key: string) {
    return this._values.hasOwnProperty(key);
  }

  add(key: string, value: LastValueObservable<any>) {
    this._values[key] = value;
    this._version++;
  }

  updateWithLatestValue(key: string, latestValue: Object) {
    this._values[key].latestValue = latestValue;
    this._version++;
  }
}
