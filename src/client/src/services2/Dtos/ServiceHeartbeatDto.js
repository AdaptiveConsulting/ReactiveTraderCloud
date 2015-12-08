export default class ServiceHeartbeatDto {
    constructor(serviceType : string, id : string, timestamp : number, serviceLoad : Number) {
        this.serviceType = serviceType;
        this.id = id;
        this.serviceLoad = serviceLoad;
    }
}
