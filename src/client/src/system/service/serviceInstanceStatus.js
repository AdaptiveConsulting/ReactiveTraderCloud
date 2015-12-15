import Guard from '../guard';

var id = 1;
export default class ServiceInstanceStatus {
    static createForDisconnected(serviceType : string, serviceId : string) {
        return new ServiceInstanceStatus(serviceType, serviceId, NaN, NaN, false);
    }
    static createForConnected(serviceType : string, serviceId : string, timestamp : number, serviceLoad : Number) {
        return new ServiceInstanceStatus(serviceType, serviceId, timestamp, serviceLoad, true);
    }
    constructor(serviceType : string, serviceId : string, timestamp : number, serviceLoad : Number, isConnected : Boolean) {
        Guard.stringIsNotEmpty(serviceType, 'serviceType must be as string and not empty');
        Guard.stringIsNotEmpty(serviceId, 'serviceId must be as string and not empty');
        this.id = id++;
        this.serviceType = serviceType;
        this.serviceId = serviceId;
        this.serviceLoad = serviceLoad;
        this.isConnected = isConnected;
    }
}
