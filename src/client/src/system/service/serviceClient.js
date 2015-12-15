import Guard from '../guard';
import Rx from 'rx';
import logger from '../logger';
import disposables from '../disposables';
import schedulerService from '../schedulerService';
import Connection from './connection';
import _ from 'lodash';
import ServiceInstanceStatus from './serviceInstanceStatus';
import ServiceInstanceSummary from './serviceInstanceSummary';
import ServiceStatusSummary from './serviceStatusSummary';
import LastValueObservableDictionary from './lastValueObservableDictionary';

export default class ServiceClient extends disposables.DisposableBase {
    _log : logger.Logger;
    _serviceInstanceDictionaryStream : Rx.Observable<LastValueObservableDictionary>;
    static get HEARTBEAT_TIMEOUT() : Number {
        return 3000;
    }
    constructor(serviceType : string, connection : Connection, schedulerService : SchedulerService){
        super();
        Guard.stringIsNotEmpty(serviceType, 'serviceType required and should not be empty');
        Guard.isDefined(connection, 'connection required');
        Guard.isDefined(schedulerService, 'schedulerService required');
        this._log = logger.create('ServiceClient:' + serviceType);
        this._connection = connection;
        this._schedulerService = schedulerService;
        // create a connectible observable that yields a dictionary of connection status for
        // each service we're exposed.
        // The dictionary support querying by service load, handy when we kick off new operations.
        // note we replay the last value as we don't want to hang around as we kick off new wire operations.
        this._serviceInstanceDictionaryStream = this._createServiceInstanceDictionaryStream(serviceType).replay(1);
    }
    // Sits on top of our underlying dictionary stream exposing a summary of the connection and services instance
    // for this service client
    get serviceStatusSummaryStream() : Rx.Observable<ServiceStatusSummary> {
        var _this = this;
        return this._serviceInstanceDictionaryStream
            .select(cache => _this._createServiceStatusSummary(cache))
            .publish()
            .refCount();
    }
    // connects the underlying status observable
    connect() : void {
        this.addDisposable(this._serviceInstanceDictionaryStream.connect());
    }
    // Multiplexes the underlying connection status stream by service instance heartbeats, then wraps these up as
    // an observable dictionary which can be queried (for connection status and min load) on a per operation basis.
    // For example, first we listen to an underlying connection status of bool, when true, we subscribe
    // for service heartbeats, we group service heartbeats by serviceId and add service level heartbeat timeouts, finally
    // we wrap all the hot service instance streams into a dictionary like structure. This structure can be queried at subscribe
    // time to determine which service instance is connected and has minimum load for a given operation.
    _createServiceInstanceDictionaryStream(serviceType:string) : Rx.Observable<LastValueObservableDictionary> {
        let _this = this;
        return Rx.Observable.create(o => {
            let serviceStatusStream = this._connection
                .getWellKnownStream('status')
                .where(s => s.Type === serviceType)
                .select(status => ServiceInstanceStatus.createForConnected(status.Type, status.Instance, status.TimeStamp, status.Load))
                .groupBy(serviceStatus => serviceStatus.serviceId)
                // add service instance level heartbeat timeouts, i.e. each service instance can disconnect independently
                .timeoutInnerObservables(ServiceClient.HEARTBEAT_TIMEOUT, serviceId => ServiceInstanceStatus.createForDisconnected(serviceType, serviceId), _this._schedulerService.timeout)
                // wrap all our service instances up in a hot observable dictionary so we query the service with the least load on a per-subscribe basis
                .toLastValueObservableDictionary(serviceStatus => serviceStatus.serviceId);
            let connectionStatus = this._connection.connectionStatusStream.publish().refCount();
            let isConnectedStream = connectionStatus.where(isConnected => isConnected);
            let isDisconnectedStream = connectionStatus.where(isConnected => !isConnected);
            return isConnectedStream
                .take(1)
                .selectMany(serviceStatusStream)
                .takeUntil(isDisconnectedStream)
                // return an empty LastValueObservableDictionary on disconnect
                .concat(Rx.Observable.return( new LastValueObservableDictionary()))
                // on disconnects we repeat our underlying status stream indefinitely
                .repeat()
                .subscribe(o)
        });
    }
    createRequestResponseOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<TResponse> {
        return Rx.Observable.empty();
    }
    createStreamOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<TResponse> {
        return Rx.Observable.empty();
    }
    _createServiceStatusSummary(cache : LastValueObservableDictionary) : ServiceStatusSummary {
        var instanceSummaries = _(cache.values)
            .map((item : LastValueObservable) => new ServiceInstanceSummary(item.latestValue.serviceId, item.latestValue.isConnected))
            .value();
        var isConnected = _(instanceSummaries)
            .some((item : ServiceInstanceSummary) => item.isConnected);
        return new ServiceStatusSummary(instanceSummaries, isConnected);
    }
}
