import _ from 'lodash';
import ServiceInstanceSummary from './serviceInstanceSummary';

/**
 * Provides a summary of the current connection status as well as statuses for connected service instances
 */
export default class ServiceStatusSummary {
    constructor(instances:Array<ServiceInstanceSummary>, isConnected:Boolean) {
        this._instances = instances;
        this._isConnected = isConnected;
    }

    get instances() {
        return this._instances;
    }

    get isConnected() {
        return this._isConnected;
    }

    getInstanceSummary(serviceId:String) {
        var instance = _(this._instances).find((instance:ServiceInstanceSummary) => instance.instanceId === serviceId);
        return instance;
    }

    toString() {
        return `ServiceInstanceCount:${this._instances.length}, IsConnected:${this.isConnected}`;
    }
}
