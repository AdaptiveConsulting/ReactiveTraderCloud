import Rx from 'rx';
import system from 'system';
import autobahn from 'autobahn';
import model from './model';
import Connection from './Connection';
import _ from 'lodash';

class ServiceCache {
    constructor() {
        this._serviceInstances = { };
    }
    addOrUpdateServiceInstance(instance: model.ServiceInstanceStatus) {
        return this._serviceInstances[instance.id] = instance;
    }
    getServiceWithLeastLoad() : model.ServiceInstanceStatus {
        var serviceWithMinLoad = _(this._serviceInstances)
            .filter(service => service.isConnected)
            .min(service => service.load);
        return serviceWithMinLoad;
    }
}

export default class ServiceClient extends system.disposables.DisposableBase {

    _url : string;
    _realm : string;
    _connectionStatusSubject : Rx.BehaviorSubject<model.ServiceInstanceStatus>;
    _log : system.logger.Logger;

    constructor(serviceName : string, connection : Connection){
        super();
        this._connection = connection;
        this._serviceStatusStream = this._getServiceStatusStream(serviceName);
        this._log = system.logger.create('ServiceClient:' + serviceName);
    }

    get serviceStatusStream() : rx.Observable<Boolean> {
        return this._serviceStatusStream
            .select(s => s.isConnected)
            .asObservable();
    }

    _getServiceStatusStream(serviceName:string) : Rx.Observable<model.ServiceInstanceStatus> {
        return rx.Observable.create((o:Rx.Observer<T>) => {
            this._connection.connectionStatus
                .distinctUntilChanged()
                .select(isConnected => {
                    return isConnected
                        ?  this._connection.getTopicStream<model.ServiceInstanceStatus>('status')
                                .where(status => status.serviceType === serviceName)
                                .select(status => model.ServiceInstanceStatus.createForConnected(serviceName, status.id, status.timeStamp, status.load))
                        : rx.Observable.return(model.ServiceInstanceStatus.createForDisconnected(serviceName)).concat(rx.Observable.never());
                })
                .switch()
                .subscribe(o)
        })
        .publishValue(model.ServiceInstanceStatus.createForDisconnected(serviceName))
        .scan(this._cacheService, new ServiceCache())
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
