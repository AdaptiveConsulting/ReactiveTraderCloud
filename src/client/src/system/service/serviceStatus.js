import _ from 'lodash';
import ServiceInstanceStatus from './serviceInstanceStatus';

/**
 * Provides a status of the instances for a given service type
 */
export default class ServiceStatus {
  constructor(serviceType:string, instanceStatuses:Array<ServiceInstanceStatus>, isConnected:boolean) {
    this._serviceType = serviceType;
    this._instanceStatuses = instanceStatuses;
    this._isConnected = isConnected;
    this._connectedInstanceCount = _(this._instanceStatuses)
      .filter((instance:ServiceInstanceStatus) => instance.isConnected)
      .value()
      .length;
  }

  get serviceType():string {
    return this._serviceType;
  }

  get intanceStatuses():Array<ServiceInstanceStatus> {
    return this._instanceStatuses;
  }

  get connectedInstanceCount():number {
    return this._connectedInstanceCount;
  }

  get isConnected():boolean {
    return this._isConnected;
  }

  getInstanceStatus(serviceId:string):ServiceInstanceStatus {
    var instanceStatus = _(this._instanceStatuses).find((instance:ServiceInstanceStatus) => instance.serviceId === serviceId);
    return instanceStatus;
  }

  toString():string {
    return `ConnectedInstanceCount:${this._connectedInstanceCount}, IsConnected:${this.isConnected}`;
  }
}
