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
    this._connectedInstanceCount = _(this._intanceStatuses)
      .filter((instance:ServiceInstanceStatus) => instance.isConnected)
      .value()
      .length;
  }

  get serviceType():String {
    return this._serviceType;
  }

  get intanceStatuses():Array<ServiceInstanceStatus> {
    return this._intanceStatuses;
  }

  get connectedInstanceCount():Number {
    return this._connectedInstanceCount;
  }

  get isConnected():Boolean {
    return this._isConnected;
  }

  getInstanceStatus(serviceId:String):ServiceInstanceStatus {
    var instanceStatus = _(this._intanceStatuses).find((instance:ServiceInstanceStatus) => instance.serviceId === serviceId);
    return instanceStatus;
  }

  toString():String {
    return `ConnectedInstanceCount:${this._connectedInstanceCount}, IsConnected:${this.isConnected}`;
  }
}
