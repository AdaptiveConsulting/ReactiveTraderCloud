import * as _ from 'lodash'

import ServiceInstanceStatus from './serviceInstanceStatus'

/**
 * Provides a status of the instances for a given service type
 */
export default class ServiceStatus {

  _instanceStatuses: Array<ServiceInstanceStatus>

  constructor(serviceType: string, instanceStatuses: Array<ServiceInstanceStatus>, isConnected: boolean) {
    this._serviceType = serviceType
    this._instanceStatuses = instanceStatuses
    this._isConnected = isConnected
    this._connectedInstanceCount = this._instanceStatuses
      .filter((instance: ServiceInstanceStatus) => instance.isConnected)
      .length
  }

  _serviceType: string

  get serviceType(): string {
    return this._serviceType
  }

  _isConnected: boolean

  get isConnected(): boolean {
    return this._isConnected
  }

  _connectedInstanceCount: number

  get connectedInstanceCount(): number {
    return this._connectedInstanceCount
  }

  get intanceStatuses(): Array<ServiceInstanceStatus> {
    return this._instanceStatuses
  }

  getInstanceStatus(serviceId: string) {
    let instanceStatus = _(this._instanceStatuses).find((instance: ServiceInstanceStatus) => instance.serviceId === serviceId)
    return instanceStatus
  }

  toString(): string {
    return `ConnectedInstanceCount:${this._connectedInstanceCount}, IsConnected:${this.isConnected}`
  }
}
