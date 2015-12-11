import _ from 'lodash';
import LastValueObservable from './lastValueObservable';

export default class ServiceInstanceCache {
    get serviceInstanceCount() {
        return _.keys(this).length;
    }
    get isConnected() {
        return _.some(this, (item : LastValueObservable) => {
            return item.latestValue.isConnected;
        });
    }
    add(key : String, value : LastValueObservable) {
        this[key] = value;
    }
    updateWithLastestValue(key : String, latestValue: Object) {
        this[key].latestValue = latestValue;
    }
}
