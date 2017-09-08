import ServiceClient from './serviceClient'
import { DisposableBase } from '../disposables'

export default class ServiceBase extends DisposableBase {
  serviceClient

  constructor(serviceType, connection) {
    super()

    this.serviceClient = new ServiceClient(
      serviceType,
      connection,
    )
  }

  get serviceStatusStream() {
    return this.serviceClient.serviceStatusStream
  }

  connect() {
    this.serviceClient.connect()
  }
}
