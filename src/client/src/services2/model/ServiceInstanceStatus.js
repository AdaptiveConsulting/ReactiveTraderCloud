export default class ServiceInstanceStatus {
    static createForDisconnected(serviceType : string) {
        return new ServiceInstanceStatus(serviceType, '', NaN, NaN, true);
    }
    static createForConnected(serviceType : string, id : string, timestamp : number, serviceLoad : Number) {
        return new ServiceInstanceStatus(serviceType, id, timestamp, serviceLoad, true);
    }
    constructor(serviceType : string, id : string, timestamp : number, serviceLoad : Number, isConnected : Boolean) {
        this.serviceType = serviceType;
        this.id = id;
        this.serviceLoad = serviceLoad;
        this.isConnected = isConnected;
    }
}
