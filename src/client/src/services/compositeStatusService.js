import { DisposableBase } from 'esp-js/src';
import { ServiceStatusLookup } from './model';
import { PricingService, ReferenceDataService, BlotterService, ExecutionService, AnalyticsService } from './';
import { Connection, ServiceStatus } from './../system/service';
import { ConnectionType } from './../services/model';

export default class CompositeStatusService extends DisposableBase {
  _connection:Connection;
  _pricingService:PricingService;
  _referenceDataService:ReferenceDataService;
  _blotterService:BlotterService;
  _executionService:ExecutionService;
  _analyticsService:AnalyticsService;

  constructor(connection:Connection,
              pricingService:PricingService,
              referenceDataService:PricingService,
              blotterService:BlotterService,
              executionService:ExecutionService,
              analyticsService:AnalyticsService) {
    super();
    this._connection = connection;
    this._pricingService = pricingService;
    this._referenceDataService = referenceDataService;
    this._blotterService = blotterService;
    this._executionService = executionService;
    this._analyticsService = analyticsService;
    this._serviceStatusStream = this._createServiceStatusStream();
    this._currentServiceStatusLookup = new ServiceStatusLookup();
  }

  /**
   * A true/false stream indicating if we're connected on the wire
   * @returns {*}
   */
  get connectionStatusStream():Rx.Observable<boolean> {
    return this._connection.connectionStatusStream;
  }

  /**
   * The current isConnected status
   * @returns {*}
   */
  get isConnected():boolean {
    return this._connection.isConnected;
  }

  /**
   * Connection url
   * @returns {string}
   */
  get connectionUrl():string {
    return this._connection.url;
  }

  /**
   * Connection type
   * @returns {ConnectionType}
   */
  get connectionType():ConnectionType {
    return this._connection.type;
  }

  /**
   * THe current ServiceStatusLookup
   * @returns {model.ServiceStatusLookup}
   */
  get serviceStatus() : ServiceStatusLookup {
    return this._currentServiceStatusLookup;
  }

  /**
   * A stream of ServiceStatusLookup which can be queried for individual service connection status
   * @returns {Rx.Observable.<ServiceStatusLookup>}
   */
  get serviceStatusStream():Rx.Observable<ServiceStatusLookup> {
    return this._serviceStatusStream.asObservable();
  }

  // since we expose some synchronous state state that's derived from
  // async streams we need an explicit start to ensure the streams are always hot
  start() {
    this.addDisposable(
      this._serviceStatusStream.subscribe(update => {
        this._currentServiceStatusLookup = update;
      })
    );
    this.addDisposable(this._serviceStatusStream.connect());
  }

  _createServiceStatusStream():Rx.Observable<ServiceStatusLookup> {
    // merge then scan all our underlying service status streams into a single
    // data structure (ServiceStatusLookup) we can query for the current status.
    return Rx.Observable
      .merge(
        this._pricingService.serviceStatusStream,
        this._referenceDataService.serviceStatusStream,
        this._blotterService.serviceStatusStream,
        this._executionService.serviceStatusStream,
        this._analyticsService.serviceStatusStream)
      .scan(
        (statusLookup:ServiceStatusLookup, serviceStatus:ServiceStatus) => statusLookup.updateServiceStatus(serviceStatus),
        // seed the stream with the initial, empty 'status' data structure
        new ServiceStatusLookup())
      .publish();
  }
}
