import _ from 'lodash';
import LastValueObservable from './lastValueObservable';

// poor mans dictionary
export default class LastValueObservableDictionary {
    constructor(description : String) {
        this._values = {};
        this._version = 0;
        this._description = description;
    }
    hasKey(key : String) {
        return this._values.hasOwnProperty(key);
    }
    add(key : String, value : LastValueObservable) {
        this._values[key] = value;
        this._version++;
    }
    updateWithLatestValue(key : String, latestValue: Object) {
        this._values[key].latestValue = latestValue;
        this._version++;
    }
    get values() {
        return this._values;
    }
    get version() {
        return this._version;
    }
    get description() {
        return this._description;
    }
}
