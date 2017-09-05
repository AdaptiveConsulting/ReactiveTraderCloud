import { Observable } from 'rxjs/Rx';
import DisposableBase from './DisposableBase';
import { ServiceStatusLookup } from './model';
import { ConnectionType } from './../services/model';

export default class CompositeStatusService extends DisposableBase {
  _connection;
  _pricingService;
  _referenceDataService;
  _blotterService;
  _executionService;
  _analyticsService;

  constructor(connection,
              pricingService,
              referenceDataService,
              blotterService,
              executionService,
              analyticsService) {
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
  get connectionStatusStream() {
    return this._connection.connectionStatusStream;
  }

  /**
   * The current isConnected status
   * @returns {*}
   */
  get isConnected() {
    return this._connection.isConnected;
  }

  /**
   * Connection url
   * @returns {string}
   */
  get connectionUrl() {
    return this._connection.url;
  }

  /**
   * Connection type
   * @returns {ConnectionType}
   */
  get connectionType() {
    return this._connection.type;
  }

  /**
   * THe current ServiceStatusLookup
   * @returns {model.ServiceStatusLookup}
   */
  get serviceStatus() {
    return this._currentServiceStatusLookup;
  }

  /**
   * A stream of ServiceStatusLookup which can be queried for individual service connection status
   * @returns {Observable.<ServiceStatusLookup>}
   */
  get serviceStatusStream() {
    return this._serviceStatusStream;
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

  _createServiceStatusStream() {
    // merge then scan all our underlying service status streams into a single
    // data structure (ServiceStatusLookup) we can query for the current status.
    return Observable
      .merge(
        this._pricingService.serviceStatusStream,
        this._referenceDataService.serviceStatusStream,
        this._blotterService.serviceStatusStream,
        this._executionService.serviceStatusStream,
        this._analyticsService.serviceStatusStream)
      .scan(
        (statusLookup, serviceStatus) => statusLookup.updateServiceStatus(serviceStatus),
        // seed the stream with the initial, empty 'status' data structure
        new ServiceStatusLookup())
      .publishReplay();
  }
}
