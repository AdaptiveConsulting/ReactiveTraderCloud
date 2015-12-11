export default class ServiceStatusSummary {
    constructor(serviceInstanceCount : Number, isConnected : Boolean) {
        this.serviceInstanceCount = serviceInstanceCount;
        this.isConnected = isConnected;
    }
    toString() {
        return 'ServiceInstanceCount:' + this.serviceInstanceCount + ', IsConnected:' +this.isConnected;
    }
}
