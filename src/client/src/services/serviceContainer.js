import system from 'system';
import Rx from 'rx';
import { PricingService, ReferenceDataService, BlotterService, ExecutionService, AnalyticsService, FakeUserRepository } from './';
import { User, ServiceConst, ServiceStatusLookup } from './model';
import { OpenFin } from '../system/openFin';

var _log:system.logger.Logger = system.logger.create('ServiceContainer');

/**
 * Poor mans container, configures then exposes instances of various backend services and their connection status
 */
export default class ServiceContainer {
  _connection:system.service.Connection;
  _pricingService:PricingService;
  _referenceDataService:PricingService;
  _blotterService:BlotterService;
  _executionService:ExecutionService;
  _analyticsService:AnalyticsService;
  _openFin:OpenFin;
  _serviceStatusStream: Rx.Observable<ServiceStatusLookup>;
  _currentServiceStatusLookup : ServiceStatusLookup;
  _isStarted: Boolean;

  constructor() {

    // Note: this is largely a stop gap measure of configuring the service layer as we don't have any bootstrapping infrastructure ATM.
    // Not a great pattern having a singelton container that all services hang off, I would expect to see a more explicit bootstrapper
    // that orchestrates app startup and provides services to objects that need it.

    var user : User = FakeUserRepository.currentUser;
    var url = 'ws://' + location.hostname + ':8080/ws', realm = 'com.weareadaptive.reactivetrader';
    var schedulerService = new system.SchedulerService();
    var autobahnProxy = new system.service.AutobahnConnectionProxy(url, realm);
    this._connection = new system.service.Connection(user.code, autobahnProxy, schedulerService);

    this._openFin = new OpenFin();
    this._referenceDataService = new ReferenceDataService(ServiceConst.ReferenceServiceKey, this._connection, schedulerService);
    this._pricingService = new PricingService(ServiceConst.PricingServiceKey, this._connection, schedulerService, this._referenceDataService);
    this._blotterService = new BlotterService(ServiceConst.BlotterServiceKey, this._connection, schedulerService, this._referenceDataService);
    this._executionService = new ExecutionService(ServiceConst.ExecutionServiceKey, this._connection, schedulerService, this._openFin);
    this._analyticsService = new AnalyticsService(ServiceConst.AnalyticsServiceKey, this._connection, schedulerService);

    this._serviceStatusStream = this._createServiceStatusStream();
    this._currentServiceStatusLookup = new ServiceStatusLookup();
    this._isStarted = false;
  }

  /**
   * A true/false stream indicating if we're connected on the wire
   * @returns {*}
   */
  get connectionStatusStream():Rx.Observable<Boolean> {
    return this._connection.connectionStatusStream;
  }

  /**
   * The current isConnected status
   * @returns {*}
   */
  get isConnected():Boolean {
    return this._connection.isConnected;
  }

  /**
   * A stream of ServiceStatusLookup which can be queried for individual service connection status
   * @returns {Rx.Observable.<model.ServiceStatusLookup>}
   */
  get serviceStatusStream() : Rx.Observable<ServiceStatusLookup> {
    return this._serviceStatusStream;
  }

  /**
   * THe current ServiceStatusLookup
   * @returns {model.ServiceStatusLookup}
   */
  get serviceStatus() : ServiceStatusLookup {
    return this._currentServiceStatusLookup;
  }

  get pricingService() {
    return this._pricingService;
  }

  get referenceDataService() {
    return this._referenceDataService;
  }

  get blotterService() {
    return this._blotterService;
  }

  get executionService() {
    return this._executionService;
  }

  get analyticsService() {
    return this._analyticsService;
  }

  get openFin() {
    return this._openFin;
  }

  start() : void {
    if(!this._isStarted) {
      this._isStarted = true;
      _log.debug('Start called');
      this._pricingService.connect();
      this._referenceDataService.connect();
      this._blotterService.connect();
      this._executionService.connect();
      this._analyticsService.connect();
      this._serviceStatusStream.subscribe(update => {
        this._currentServiceStatusLookup = update;
      });
      this._connection.connect();
    }
  }

  reConnect() : void {
    this._connection.connect();
  }

  _createServiceStatusStream() : Rx.Observable<ServiceStatusLookup>{
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
        (statusLookup:ServiceStatusLookup, serviceStatus:system.service.ServiceStatus) => statusLookup.updateServiceStatus(serviceStatus),
        // seed the stream with the initial, empty 'status' data structure
        new ServiceStatusLookup())
      .publish()
      .refCount();
  }
}

// Not a massive fan of using the 'require' statement for instance construction and resolution, however since
// we don't have any IoC setup up for this app so we just new up our poor-mans container here.
var serviceContainer = new ServiceContainer();
serviceContainer.start();

export default serviceContainer;
