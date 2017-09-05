import Guard from '../guard'

/**
 * The status of a given back end service instance
 */
export default class ServiceInstanceStatus {

  constructor(serviceType: string, serviceId: string, timestamp: number, serviceLoad: number, isConnected: boolean) {
    Guard.stringIsNotEmpty(serviceType, 'serviceType must be as string and not empty')
    Guard.stringIsNotEmpty(serviceId, 'serviceId must be as string and not empty')
    this._serviceType = serviceType
    this._serviceId = serviceId
    this._serviceLoad = serviceLoad
    this._isConnected = isConnected
    this._timestamp = timestamp
  }

  _serviceType: string

  get serviceType() {
    return this._serviceType
  }

  _serviceId: string

  get serviceId() {
    return this._serviceId
  }

  _serviceLoad: number

  get serviceLoad() {
    return this._serviceLoad
  }

  _isConnected: boolean

  get isConnected() {
    return this._isConnected
  }

  _timestamp: number

  get timestamp() {
    return this._timestamp
  }

  static createForDisconnected(serviceType: string, serviceId: string) {
    return new ServiceInstanceStatus(serviceType, serviceId, NaN, NaN, false)
  }

  static createForConnected(serviceType: string, serviceId: string, timestamp: number, serviceLoad: number) {
    return new ServiceInstanceStatus(serviceType, serviceId, timestamp, serviceLoad, true)
  }
}
