import Guard from '../guard';
import Rx from 'rx';
import logger from '../logger';
import disposables from '../disposables';
import schedulerService from '../schedulerService';
import Connection from './connection';
import _ from 'lodash';
import ServiceInstanceStatus from './serviceInstanceStatus';
import ServiceStatusSummary from './serviceStatusSummary';
import ServiceInstanceCache from './serviceInstanceCache';

const HEARTBEAT_TIMEOUT = 3000;

export default class ServiceClient extends disposables.DisposableBase {
    _log : logger.Logger;
    _serviceInstanceDictionaryStream : Rx.Observable<ServiceInstanceCache>;
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

    get serviceStatusStream() : Rx.Observable<ServiceStatusSummary> {
        return this._serviceInstanceDictionaryStream
            .select(cache => new ServiceStatusSummary(cache.serviceInstanceCount, cache.isConnected))
            .publish()
            .refCount();
    }
/*
 Example status
[{"Type":"execution","Instance":"execution.1b27","Timestamp":"2015-12-11T16:38:41.028972+00:00","Load":0}]
[{"Type":"pricing","Instance":"pricing.12b6","Timestamp":"2015-12-11T16:38:40.987076+00:00","Load":0}]
[{"Type":"reference","Instance":"reference.aa3e","Timestamp":"2015-12-11T16:38:40.028915+00:00","Load":0}]
[{"Type":"blotter","Instance":"blotter.92ec","Timestamp":"2015-12-11T16:38:41.029013+00:00","Load":0}]
* */

    connect() {
        this.addDisposable(this._serviceInstanceDictionaryStream.connect());
    }

    _createServiceInstanceDictionaryStream(serviceType:string) : Rx.Observable<ServiceInstanceCache> {
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
            .groupBy(serviceStatus => serviceStatus.serviceId)
            // add service instance level heartbeat timeouts, i.e. each service instance can disconnect independently
            .timeoutInnerObservables(HEARTBEAT_TIMEOUT, serviceId => ServiceInstanceStatus.createForDisconnected(serviceType, serviceId), _this._schedulerService.timeout)
            // wrap all our service instances up in a hot observable dictionary so we query the service with the least load on a per-subscribe basis
            .toLastValueObservableDictionary(serviceStatus => serviceStatus.ServiceId)
            // keep the last copy of the dictionary around for new subscribers
            .replay(1);
    }

    createRequestResponseOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<TResponse> {
        return Rx.Observable.empty();
    }
    createStreamOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<TResponse> {
        return Rx.Observable.empty();
    }
}
