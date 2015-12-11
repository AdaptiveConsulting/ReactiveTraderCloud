import ServiceInstanceSummary from './serviceInstanceSummary';

export default class ServiceStatusSummary {
    constructor(instances : Array<ServiceInstanceSummary>, isConnected : Boolean) {
        this._instances = instances;
        this._isConnected = isConnected;
    }
    get instances() {
        return this._instances;
    }
    get isConnected() {
        return this._isConnected;
    }
    toString() {
        return 'ServiceInstanceCount:' + this._instances.length + ', IsConnected:' +this.isConnected;
    }
}
