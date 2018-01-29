import { Observable, Subscription } from 'rxjs/Rx'
import { ServiceConst, ServiceStatus } from '../types'

export default function compositeStatusService(
  connection,
  pricingService,
  referenceDataService,
  blotterService,
  executionService,
  analyticsService
): Object {
  const disposables = new Subscription()
  const addDisposable = disposable => {
    // esp-js is expecting a dispose method
    disposables.add(disposable)
  }
  const serviceStatusStream = Observable.merge(
    pricingService.serviceStatusStream,
    referenceDataService.serviceStatusStream,
    blotterService.serviceStatusStream,
    executionService.serviceStatusStream,
    analyticsService.serviceStatusStream
  )
    .scan(
      (statusLookup: any, serviceStatus) =>
        statusLookup.updateServiceStatus(serviceStatus),
      // seed the stream with the initial, empty 'status' data structure
      new ServiceStatusLookup()
    )
    .publishReplay()
  let currentServiceStatusLookup = new ServiceStatusLookup()
  // since we expose some synchronous state state that's derived from
  // async streams we need an explicit start to ensure the streams are always hot
  addDisposable(
    serviceStatusStream.subscribe(update => {
      currentServiceStatusLookup = update
    })
  )
  addDisposable(serviceStatusStream.connect())
  return {
    /**
   * A true/false stream indicating if we're connected on the wire
   * @returns {*}
   */
    get connectionStatusStream() {
      return connection.connectionStatusStream
    },

    /**
   * The current isConnected status
   * @returns {*}
   */
    get isConnected() {
      return connection.isConnected
    },

    /**
   * Connection url
   * @returns {string}
   */
    get connectionUrl() {
      return connection.url
    },

    /**
   * Connection type
   * @returns {ConnectionType}
   */
    get connectionType() {
      return connection.type
    },

    /**
   * THe current ServiceStatusLookup
   * @returns {model.ServiceStatusLookup}
   */
    get serviceStatus() {
      return currentServiceStatusLookup
    },
    serviceStatusStream,
    connection
  }
}

/**
 * A data structure that can be used to look up the current statuses of well known services.
 */
class ServiceStatusLookup {
  services: Object = {}

  get pricing(): ServiceStatus {
    return this.services[ServiceConst.PricingServiceKey]
  }

  get reference(): ServiceStatus {
    return this.services[ServiceConst.ReferenceServiceKey]
  }

  get blotter(): ServiceStatus {
    return this.services[ServiceConst.BlotterServiceKey]
  }

  get execution(): ServiceStatus {
    return this.services[ServiceConst.ExecutionServiceKey]
  }

  get analytics(): ServiceStatus {
    return this.services[ServiceConst.AnalyticsServiceKey]
  }

  updateServiceStatus(serviceStatus: ServiceStatus) {
    this.services[serviceStatus.serviceType] = serviceStatus
    return this
  }
}
