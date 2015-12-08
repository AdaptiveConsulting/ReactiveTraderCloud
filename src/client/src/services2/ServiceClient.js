import Rx from 'rx';
import system from 'system';
import autobahn from 'autobahn';
import model from './model';
import Connection from './Connection';
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
    createRequestResponse<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<T> {

    }
    createStream<TRequest, TResponse>(request : TRequest, response : TResponse) : Rx.Observable<T> {

    }
}

class ServiceInstanceStream extends system.disposables.DisposableBase {
    constructor(schedulerService : system.SchedulerService) {
        super();
        this._schedulerService = schedulerService;
        this._serviceLoad = NaN;
        this._isConnected = false;
        this._connectable = this._serviceInstanceConnectionStatus
            .timeout(HEARTBEAT_TIMEOUT, Rx.Observable.return(false), this._schedulerService.timeout)
            // TODO does this need a repeat?
            .distinctUntilChanged()
            .publishLast();
    }
    get connectionStatus() {
        return this._connectable.asObservable();
    }
    get serviceLoad() {
        return this._serviceLoad;
    }
    get isConnected() {
        return this._isConnected;
    }
    connect() {
        this.addDisposable(this._connectable.connect());
    }
    onUpdate(serviceLoad : Number) {
        this._serviceLoad = serviceLoad;
        this._isConnected = true;
        this._serviceInstanceConnectionStatus.onNext(this._isConnected);
    }
    markDisconnected() {
        this._serviceLoad = NaN;
        this._isConnected = false;
        this._serviceInstanceConnectionStatus.onNext(this._isConnected);
    }
}

class ServiceCache extends system.disposables.DisposableBase {
    constructor(schedulerService:system.SchedulerService) {
        super();
        this._serviceInstances = {};
        this._schedulerService = schedulerService;
    }
    addOrUpdateServiceInstance(instance:model.ServiceInstanceStatus) {
        if (instance.isConnected) {
            var instance = this._serviceInstances[instance.id];
            if (!instance) {
                instance = new ServiceInstanceStream(this._schedulerService);
                this._serviceInstances[instance.id] = instance;
                this.addDisposable(instance);
                instance.connect();
            } else {
                instance.keepAlive(instance.serviceLoad);
            }
        } else {
            _.forOwn(i => {
                i.markDisconnected();
            });
        }
    }
    getServiceWithLeastLoad():model.ServiceInstanceStatus {
        var serviceWithMinLoad = _(this._serviceInstances)
            .filter(service => service.isConnected)
            .min(service => service.serviceLoad);
        return serviceWithMinLoad;
    }
}
