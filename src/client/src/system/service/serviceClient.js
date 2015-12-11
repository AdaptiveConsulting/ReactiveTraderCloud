import Rx from 'rx';
import logger from '../logger';
import disposables from '../disposables';
import schedulerService from '../schedulerService';
import autobahn from 'autobahn';
import Connection from './connection';
import _ from 'lodash';
import ServiceInstanceStatus from './serviceInstanceStatus';

const HEARTBEAT_TIMEOUT = 3000;

export default class ServiceClient extends disposables.DisposableBase {
    _connectionStatusSubject : Rx.BehaviorSubject<ServiceInstanceStatus>;
    _log : logger.Logger;
    constructor(serviceName : string, connection : Connection, schedulerService : SchedulerService){
        super();
        this._connection = connection;
        this._schedulerService = schedulerService;
        this._serviceStatusStream = this._getServiceStatusStream(serviceName);
        this._log = logger.create('ServiceClient:' + serviceName);
    }
    get serviceStatusStream() : Rx.Observable<Boolean> {
        return this._serviceStatusStream
           // .select(s => s.isConnected)
            .asObservable();
    }
    _getServiceStatusStream(serviceName:string) : Rx.Observable<ServiceInstanceStatus> {
        var _this = this;
        //return Rx.Observable.create((o:Rx.Observer<T>) => {
        //    this._connection.connectionStatus
        //        .select(isConnected => {
        //            var stream = isConnected
        //                ?  _this._connection.getTopicStream('status')
        //                        .where(status => status.Type === serviceName)
        //                        .select(status => ServiceInstanceStatus.createForConnected(serviceName, status.Instance, status.TimeStamp, status.Load))
        //                : Rx.Observable.return(ServiceInstanceStatus.createForDisconnected(serviceName)).concat(Rx.Observable.never());
        //            return stream;
        //        })
        //        .switch()
        //        .subscribe(o)
        //})
        //.startWith(ServiceInstanceStatus.createForDisconnected(serviceName))
        //.scan(this._cacheService, new ServiceCache(_this._schedulerService))
        //.publishLast()
        //.refCount();
        return Rx.Observable.never();
    }
    //_cacheService(cache : ServiceCache, serviceStatus : ServiceInstanceStatus) : ServiceCache {
    //    cache.addOrUpdateServiceInstance(serviceStatus);
    //    return cache;
    //}
    //
    //createRequestResponseOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<T> {
    //
    //}
    //createStreamOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<T> {
    //
    //}
}
