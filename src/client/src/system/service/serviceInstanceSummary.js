export default class ServiceInstanceSummary {
  constructor(instanceId:String, isConnected:Boolean) {
    this.instanceId = instanceId;
    this.isConnected = isConnected;
  }

  toString() {
    return 'InstanceId:' + this.instanceId + ', IsConnected:' + this.isConnected;
  }
}
