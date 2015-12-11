import Rx from 'rx';
import system from 'system';
import autobahn from 'autobahn';
import model from './model';
import Connection from './connection';
import _ from 'lodash';

const HEARTBEAT_TIMEOUT = 3000;

export default class ServiceClient extends system.disposables.DisposableBase {
    _connectionStatusSubject : Rx.BehaviorSubject<model.ServiceInstanceStatus>;
    _log : system.logger.Logger;
    constructor(serviceName : string, connection : Connection, schedulerService : system.SchedulerService){
        super();
        this._connection = connection;
        this._schedulerService = schedulerService;
        this._serviceStatusStream = this._getServiceStatusStream(serviceName);
        this._log = system.logger.create('ServiceClient:' + serviceName);
    }
    get serviceStatusStream() : Rx.Observable<Boolean> {
        return this._serviceStatusStream
           // .select(s => s.isConnected)
            .asObservable();
    }
    _getServiceStatusStream(serviceName:string) : Rx.Observable<model.ServiceInstanceStatus> {
        var _this = this;
        return Rx.Observable.create((o:Rx.Observer<T>) => {
            this._connection.connectionStatus
                .select(isConnected => {
                    var stream = isConnected
                        ?  _this._connection.getTopicStream('status')
                                .where(status => status.Type === serviceName)
                                .select(status => model.ServiceInstanceStatus.createForConnected(serviceName, status.Instance, status.TimeStamp, status.Load))
                        : Rx.Observable.return(model.ServiceInstanceStatus.createForDisconnected(serviceName)).concat(Rx.Observable.never());
                    return stream;
                })
                .switch()
                .subscribe(o)
        })
        .startWith(model.ServiceInstanceStatus.createForDisconnected(serviceName))
        .scan(this._cacheService, new ServiceCache(_this._schedulerService))
        .publishLast()
        .refCount();
    }
    _cacheService(cache : ServiceCache, serviceStatus : model.ServiceInstanceStatus) : ServiceCache {
        cache.addOrUpdateServiceInstance(serviceStatus);
        return cache;
    }

    createRequestResponseOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<T> {

    }
    createStreamOperation<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<T> {

    }
}
