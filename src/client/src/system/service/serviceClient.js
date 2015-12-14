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

    static get HEARTBEAT_TIMEOUT() {
        return 3000;
    }

    constructor(serviceType : string, connection : Connection, schedulerService : SchedulerService){
        super();
        Guard.stringIsNotEmpty(serviceType, 'serviceType required and should not be empty');
        Guard.isDefined(connection, 'connection required');
        Guard.isDefined(schedulerService, 'schedulerService required');
        this._connection = connection;
        this._schedulerService = schedulerService;
        this._serviceInstanceDictionaryStream = this._createServiceInstanceDictionaryStream(serviceType);
        this._log = logger.create('ServiceClient:' + serviceType);
    }
    get serviceStatusSummaryStream() : Rx.Observable<ServiceStatusSummary> {
        var _this = this;
        return this._serviceInstanceDictionaryStream
            .select(cache => _this._createServiceStatusSummary(cache))
            .publish()
            .refCount();
    }
    connect() {
        this.addDisposable(this._serviceInstanceDictionaryStream.connect());
    }
    _createServiceInstanceDictionaryStream(serviceType:string) : Rx.Observable<LastValueObservableDictionary> {
        var _this = this;
        var connectionStatus = this._connection.connectionStatusStream.publish().refCount();
        var isConnectedStream = connectionStatus.where(isConnected => isConnected);
        var isDisconnectedStream = connectionStatus.where(isConnected => !isConnected);
        var serviceStatusStream = this._connection
            .getWellKnownStream('status')
            .where(s => s.Type === serviceType)
            .select(status => ServiceInstanceStatus.createForConnected(status.Type, status.Instance, status.TimeStamp, status.Load))
            .takeUntilAndEndWith(isDisconnectedStream, lastServiceStatus => ServiceInstanceStatus.createForDisconnected(serviceType, lastServiceStatus.ServiceId));
        return isConnectedStream
            .take(1)
            .selectMany(serviceStatusStream)
            // we repeat our underlying status stream on disconnects
            .repeat()
            // group by service instance id
            .groupBy(serviceStatus => {
                console.log("foo");
                return serviceStatus.serviceId;
            })
            // add service instance level heartbeat timeouts, i.e. each service instance can disconnect independently
            .timeoutInnerObservables(ServiceClient.HEARTBEAT_TIMEOUT, serviceId => ServiceInstanceStatus.createForDisconnected(serviceType, serviceId), _this._schedulerService.timeout)
            // wrap all our service instances up in a hot observable dictionary so we query the service with the least load on a per-subscribe basis
            .toLastValueObservableDictionary(serviceStatus => serviceStatus.serviceId)
            // keep the last copy of the dictionary around for new subscribers
            .replay(1);
    }
    createRequestResponseOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<TResponse> {
        return Rx.Observable.empty();
    }
    createStreamOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<TResponse> {
        return Rx.Observable.empty();
    }
    _createServiceStatusSummary(cache : LastValueObservableDictionary) {
        var instanceSummaries = _(cache.values)
            .map((item : LastValueObservable) => new ServiceInstanceSummary(item.latestValue.serviceId, item.latestValue.isConnected))
            .value();
        var isConnected = _(instanceSummaries)
            .some((item : ServiceInstanceSummary) => item.isConnected);
        return new ServiceStatusSummary(instanceSummaries, isConnected);
    }
}
