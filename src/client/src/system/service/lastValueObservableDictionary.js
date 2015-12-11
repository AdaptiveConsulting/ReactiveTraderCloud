import _ from 'lodash';
import LastValueObservable from './lastValueObservable';

// poor mans dictionary
export default class LastValueObservableDictionary {
    hasKey(key : String) {
        return this.hasOwnProperty(key);
    }
    add(key : String, value : LastValueObservable) {
        this[key] = value;
    }
    updateWithLatestValue(key : String, latestValue: Object) {
        this[key].latestValue = latestValue;
    }
    values() {
        return _.forOwn(this);
    }
}
