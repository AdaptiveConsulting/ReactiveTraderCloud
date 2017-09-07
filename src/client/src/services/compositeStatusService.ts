import { Observable } from 'rxjs/Rx'
import DisposableBase from './DisposableBase'
import { ServiceConst, ServiceStatus } from '../types'

export default class CompositeStatusService extends DisposableBase {
  connection
  pricingService
  referenceDataService
  blotterService
  executionService
  analyticsService
  serviceStatusStream
  currentServiceStatusLookup

  constructor(connection,
              pricingService,
              referenceDataService,
              blotterService,
              executionService,
              analyticsService) {
    super()
    this.connection = connection
    this.pricingService = pricingService
    this.referenceDataService = referenceDataService
    this.blotterService = blotterService
    this.executionService = executionService
    this.analyticsService = analyticsService
    this.serviceStatusStream = this.createServiceStatusStream()
    this.currentServiceStatusLookup = new ServiceStatusLookup()
  }

  /**
   * A true/false stream indicating if we're connected on the wire
   * @returns {*}
   */
  get connectionStatusStream() {
    return this.connection.connectionStatusStream
  }

  /**
   * The current isConnected status
   * @returns {*}
   */
  get isConnected() {
    return this.connection.isConnected
  }

  /**
   * Connection url
   * @returns {string}
   */
  get connectionUrl() {
    return this.connection.url
  }

  /**
   * Connection type
   * @returns {ConnectionType}
   */
  get connectionType() {
    return this.connection.type
  }

  /**
   * THe current ServiceStatusLookup
   * @returns {model.ServiceStatusLookup}
   */
  get serviceStatus() {
    return this.currentServiceStatusLookup
  }

  // since we expose some synchronous state state that's derived from
  // async streams we need an explicit start to ensure the streams are always hot
  start() {
    this.addDisposable(
      this.serviceStatusStream.subscribe((update) => {
        this.currentServiceStatusLookup = update
      }),
    )
    this.addDisposable(this.serviceStatusStream.connect())
  }

  createServiceStatusStream() {
    // merge then scan all our underlying service status streams into a single
    // data structure (ServiceStatusLookup) we can query for the current status.
    return Observable
      .merge(
        this.pricingService.serviceStatusStream,
        this.referenceDataService.serviceStatusStream,
        this.blotterService.serviceStatusStream,
        this.executionService.serviceStatusStream,
        this.analyticsService.serviceStatusStream)
      .scan(
        (statusLookup: any, serviceStatus) => statusLookup.updateServiceStatus(serviceStatus),
        // seed the stream with the initial, empty 'status' data structure
        new ServiceStatusLookup())
      .publishReplay()
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
