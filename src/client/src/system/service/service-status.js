import _ from 'lodash';
import ServiceInstanceStatus from './service-instance-status';

/**
 * Provides a status of the instances for a given service type
 */
export default class ServiceStatus {
  constructor(serviceType:String, instanceStatuses:Array<ServiceInstanceStatus>, isConnected:Boolean) {
    this._serviceType = serviceType;
    this._instanceStatuses = instanceStatuses;
    this._isConnected = isConnected;
    this._connectedInstanceCount = _(this._instanceStatuses)
      .filter((instance:ServiceInstanceStatus) => instance.isConnected)
      .value()
      .length;
  }

  get serviceType():String {
    return this._serviceType;
  }

  get intanceStatuses():Array<ServiceInstanceStatus> {
    return this._instanceStatuses;
  }

  get connectedInstanceCount():Number {
    return this._connectedInstanceCount;
  }

  get isConnected():Boolean {
    return this._isConnected;
  }

  getInstanceStatus(serviceId:String):ServiceInstanceStatus {
    var instanceStatus = _(this._instanceStatuses).find((instance:ServiceInstanceStatus) => instance.serviceId === serviceId);
    return instanceStatus;
  }

  toString():String {
    return `ConnectedInstanceCount:${this._connectedInstanceCount}, IsConnected:${this.isConnected}`;
  }
}
