import _ from 'lodash';
import LastValueObservable from './lastValueObservable';

// poor mans dictionary
export default class LastValueObservableDictionary {
    constructor() {
        this._values = {};
    }
    hasKey(key : String) {
        return this._values.hasOwnProperty(key);
    }
    add(key : String, value : LastValueObservable) {
        this._values[key] = value;
    }
    updateWithLatestValue(key : String, latestValue: Object) {
        this._values[key].latestValue = latestValue;
    }
    get values() {
        return this._values;
    }
}
