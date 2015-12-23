import system from 'system';
import PricingService from './pricingService';
import ReferenceDataService from './referenceDataService';
import BlotterService from './blotterService';
import ExecutionService from './executionService';
import AnalyticsService from './analyticsService';
import FakeUserRepository from './fakeUserRepository';
import model from './model';

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
  _serviceStatusStream: Rx.Observable<model.ServiceStatusLookup>;
  _currentServiceStatusLookup : model.ServiceStatusLookup;
  _isStarted: Boolean;

  constructor() {

    // Note: this is largely a stop gap measure of configuring the service layer as we don't have any bootstrapping infrastructure ATM.
    // Not a great pattern having a singelton container that all services hang off, I would expect to see a more explicit bootstrapper
    // that orchestrates app startup and provides services to objects that need it.

    var user : model.User = FakeUserRepository.currentUser;
    var url = 'ws://' + location.hostname + ':8080/ws', realm = 'com.weareadaptive.reactivetrader';
    var schedulerService = new system.SchedulerService();
    var autobahnProxy = new system.service.AutobahnConnectionProxy(url, realm);
    this._connection = new system.service.Connection(user.code, autobahnProxy, schedulerService);

    this._pricingService = new PricingService(model.ServiceConst.PricingServiceKey, this._connection, schedulerService);
    this._referenceDataService = new ReferenceDataService(model.ServiceConst.ReferenceServiceKey, this._connection, schedulerService);
    this._blotterService = new BlotterService(model.ServiceConst.BlotterServiceKey, this._connection, schedulerService);
    this._executionService = new ExecutionService(model.ServiceConst.ExecutionServiceKey, this._connection, schedulerService);
    this._analyticsService = new AnalyticsService(model.ServiceConst.AnalyticsServiceKey, this._connection, schedulerService);

    this._serviceStatusStream = this._createServiceStatusStream();
    this._currentServiceStatusLookup = new model.ServiceStatusLookup();
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
  get serviceStatusStream() : Rx.Observable<model.ServiceStatusLookup> {
    return this._serviceStatusStream;
  }

  /**
   * THe current ServiceStatusLookup
   * @returns {model.ServiceStatusLookup}
   */
  get serviceStatus() : model.ServiceStatusLookup {
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

  start() : void {
    if(!this._isStarted) {
      this._isStarted = true;
      _log.info('Start called');
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

  _createServiceStatusStream() : Rx.Observable<model.ServiceStatusLookup>{
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
        (statusLookup:model.ServiceStatusLookup, serviceStatus:system.service.ServiceStatus) => statusLookup.updateServiceStatus(serviceStatus),
        // seed the stream with the initial, empty 'status' data structure
        new model.ServiceStatusLookup())
      .publish()
      .refCount();
  }
}

// Not a massive fan of using the 'require' statement for instance construction and resolution, however since
// we don't have any IoC setup up for this app so we just new up our poor-mans container here.
var serviceContainer = new ServiceContainer();
serviceContainer.start();

export default serviceContainer;
