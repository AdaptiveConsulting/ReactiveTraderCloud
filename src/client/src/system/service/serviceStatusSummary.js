import _ from 'lodash';
import ServiceInstanceSummary from './serviceInstanceSummary';

/**
 * Provides a summary of the current connection status as well as statuses for connected service instances
 */
export default class ServiceStatusSummary {
  constructor(serviceType:String, instances:Array<ServiceInstanceSummary>, isConnected:Boolean) {
    this._serviceType = serviceType;
    this._instances = instances;
    this._isConnected = isConnected;
  }

  get serviceType():String {
    return this._serviceType;
  }

  get instances():Array<ServiceInstanceSummary> {
    return this._instances;
  }

  get instanceCount():Number {
    return this._instances.length;
  }

  get isConnected():Boolean {
    return this._isConnected;
  }

  getInstanceSummary(serviceId:String):ServiceInstanceSummary {
    var instance = _(this._instances).find((instance:ServiceInstanceSummary) => instance.instanceId === serviceId);
    return instance;
  }

  toString():String {
    return `ServiceInstanceCount:${this._instances.length}, IsConnected:${this.isConnected}`;
  }
}
