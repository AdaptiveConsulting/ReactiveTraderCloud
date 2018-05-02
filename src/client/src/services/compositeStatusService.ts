import { merge } from 'rxjs/observable/merge'
import { scan, share } from 'rxjs/operators'
import { Connection } from '../system/service/connection'
import { ServiceStatus, StatusService } from '../types'

export default function compositeStatusService(
  connection: Connection,
  services: StatusService[]
) {
  const serviceStatusStream = merge(
    ...services.map(service => service.serviceStatusStream)
  ).pipe(
    scan<ServiceStatus, ServiceStatusLookup>(
      (statusLookup, serviceStatus) =>
        statusLookup.updateServiceStatus(serviceStatus),
      new ServiceStatusLookup()
    ),
    share<ServiceStatusLookup>()
  )

  return {
    get connectionStatusStream() {
      return connection.connectionStatusStream
    },

    get isConnected() {
      return connection.isConnected
    },

    get connectionUrl() {
      return connection.url
    },

    get connectionType() {
      return connection.type
    },

    serviceStatusStream
  }
}

class ServiceStatusLookup {
  services: Object = {}

  updateServiceStatus(serviceStatus: ServiceStatus) {
    this.services[serviceStatus.serviceType] = serviceStatus
    return this
  }
}
