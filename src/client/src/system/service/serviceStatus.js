import _ from 'lodash';
import ServiceInstanceStatus from './serviceInstanceStatus';

/**
 * Provides a status of the instances for a given service type
 */
export default class ServiceStatus {
  constructor(serviceType:String, instanceStatuses:Array<ServiceInstanceStatus>, isConnected:Boolean) {
    this._serviceType = serviceType;
    this._intanceStatuses = instanceStatuses;
    this._isConnected = isConnected;
  }

  get serviceType():String {
    return this._serviceType;
  }

  get intanceStatuses():Array<ServiceInstanceStatus> {
    return this._intanceStatuses;
  }

  get instanceCount():Number {
    return this._intanceStatuses.length;
  }

  get isConnected():Boolean {
    return this._isConnected;
  }

  getInstanceStatus(serviceId:String):ServiceInstanceStatus {
    var instanceStatus = _(this._intanceStatuses).find((instance:ServiceInstanceStatus) => instance.serviceId === serviceId);
    return instanceStatus;
  }

  toString():String {
    return `ServiceInstanceCount:${this._intanceStatuses.length}, IsConnected:${this.isConnected}`;
  }
}
