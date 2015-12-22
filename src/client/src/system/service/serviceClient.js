import Rx from 'rx';
import _ from 'lodash';
import logger from '../logger';
import Guard from '../guard';
import disposables from '../disposables';
import schedulerService from '../schedulerService';
import Connection from './connection';
import ConnectionStatus from './connectionStatus';
import ServiceInstanceStatus from './serviceInstanceStatus';
import ServiceStatus from './serviceStatus';
import LastValueObservableDictionary from './lastValueObservableDictionary';

/**
 * Abstracts a back end service for which there ban be multiple instnaces.
 * Offers functionality to perform request-response and stream operations against a service instance.
 * Exposes a connection status stream.
 */
export default class ServiceClient extends disposables.DisposableBase {
  _log:logger.Logger;
  _serviceType:String;
  _serviceInstanceDictionaryStream:Rx.Observable<LastValueObservableDictionary>;

  static get HEARTBEAT_TIMEOUT():Number {
    return 3000;
  }

  constructor(serviceType:string, connection:Connection, schedulerService:SchedulerService) {
    super();
    Guard.stringIsNotEmpty(serviceType, 'serviceType required and should not be empty');
    Guard.isDefined(connection, 'connection required');
    Guard.isDefined(schedulerService, 'schedulerService required');
    this._log = logger.create(`ServiceClient:${serviceType}`);
    this._serviceType = serviceType;
    this._connection = connection;
    this._schedulerService = schedulerService;
    // create a connectible observable that yields a dictionary of connection status for
    // each service we're getting heartbeats from .
    // The dictionary support querying by service load, handy when we kick off new operations.
    this._serviceInstanceDictionaryStream = this._createServiceInstanceDictionaryStream(serviceType)
      .multicast(new Rx.BehaviorSubject(new LastValueObservableDictionary()));
  }

  /**
   * Sits on top of our underlying dictionary stream exposing a summary of the connection and services instancefor this service client
   *
   * @returns {Observable<T>}
   */
  get serviceStatusStream():Rx.Observable<ServiceStatus> {
    let _this = this;
    return this._serviceInstanceDictionaryStream
      .select(cache => _this._createServiceStatus(cache))
      .publish()
      .refCount();
  }

  // connects the underlying status observable
  connect():void {
    this.addDisposable(this._serviceInstanceDictionaryStream.connect());
  }

  /**
   * Multiplexes the underlying connection status stream by service instance heartbeats, then wraps these up as
   * an observable dictionary which can be queried (for connection status and min load) on a per operation basis.
   * For example, first we listen to an underlying connection status of bool, when true, we subscribe
   * for service heartbeats, we group service heartbeats by serviceId and add service level heartbeat timeouts/debounce, finally
   * we wrap all the service instance streams into a dictionary like structure. This structure can be queried at subscribe
   * time to determine which service instance is connected and has minimum load for a given operation.
   * @param serviceType
   * @returns {Observable}
   * @private
   */
  _createServiceInstanceDictionaryStream(serviceType:string):Rx.Observable<LastValueObservableDictionary> {
    let _this = this;
    return Rx.Observable.create(o => {
      let connectionStatus = this._connection.connectionStatusStream
        .select(status => status === ConnectionStatus.connected)
        .publish()
        .refCount();
      let isConnectedStream = connectionStatus.where(isConnected => isConnected);
      let errorOnDisconnectStream = connectionStatus.where(isConnected => !isConnected).take(1).selectMany(Rx.Observable.throw(new Error('Disconnected')));
      let serviceInstanceDictionaryStream = this._connection
        .subscribeToTopic('status')
        .where(s => s.Type === serviceType)
        .select(status => ServiceInstanceStatus.createForConnected(status.Type, status.Instance, status.TimeStamp, status.Load))
        // If the underlying connection goes down we error the stream.
        // Do this before the grouping so all grouped streams error.
        .merge(errorOnDisconnectStream)
        .groupBy(serviceStatus => serviceStatus.serviceId)
        // add service instance level heartbeat timeouts, i.e. each service instance can disconnect independently
        .debounceOnMissedHeartbeat(ServiceClient.HEARTBEAT_TIMEOUT, serviceId => ServiceInstanceStatus.createForDisconnected(serviceType, serviceId), _this._schedulerService.async)
        // flattens all our service instances stream into an observable dictionary so we query the service with the least load on a per-subscribe basis
        .toServiceStatusObservableDictionary(serviceStatus => serviceStatus.serviceId)
        // catch the disconnect error of the outter stream and continue with an empty (thus disconencted) dictionary
        .catch(Rx.Observable.return(new LastValueObservableDictionary()));
      return isConnectedStream
        .take(1)
        // selectMany: since we're just taking one, this effictively just continues the stream by subscribing to serviceInstanceDictionaryStream
        .selectMany(serviceInstanceDictionaryStream)
        // repeat after disconnects
        .repeat()
        .subscribe(o);
    });
  }

  /**
   * Gets a request-response observable that will act against a service with the min load
   *
   * @param operationName
   * @param request
   * @param waitForSuitableService if true, will wait for a service to become available before requesting, else will error the stream
   * @returns {Observable}
   */
  createRequestResponseOperation<TRequest, TResponse>(operationName:String, request:TRequest, waitForSuitableService:Boolean = false):Rx.Observable<TResponse> {
    let _this = this;
    return Rx.Observable.create((o:Rx.Observer<TResponse>) => {
      _this._log.debug('Creating request response operation');
      let disposables = new Rx.CompositeDisposable();
      let hasSubscribed = false;
      disposables.add(_this._serviceInstanceDictionaryStream
        .getServiceWithMinLoad(waitForSuitableService)
        .subscribe(serviceInstanceStatus => {
            if (!serviceInstanceStatus.isConnected) {
              o.onError(new Error('Disconnected'));
            } else if (!hasSubscribed) {
              hasSubscribed = true;
              _this._log.debug(`Will use service instance [${serviceInstanceStatus.serviceId}] for request/response operation. IsConnected: [${serviceInstanceStatus.isConnected}]`);
              let remoteProcedure:String = serviceInstanceStatus.serviceId + '.' + operationName;
              disposables.add(
                _this._connection.requestResponse(remoteProcedure, request).subscribe(
                  response => {
                    _this._log.debug(`Response received for stream operation [${operationName}]`);
                    o.onNext(response);
                  },
                  err => {
                    o.onError(err);
                  },
                  () => {
                    o.onCompleted();
                  }
                )
              );
            }
          },
          err => {
            o.onError(err);
          },
          () => {
            o.onCompleted();
          }
        ));
      return disposables;
    });
  }

  /**
   * Gets a request-responses observable that will act against a service with the min load
   *
   * @param operationName
   * @param request
   * @returns {Observable}
   */
  createStreamOperation<TRequest, TResponse>(operationName:String, request:TRequest):Rx.Observable<TResponse> {
    let _this = this;
    return Rx.Observable.create((o:Rx.Observer<TResponse>) => {
      _this._log.debug('Creating stream operation');
      let disposables = new Rx.CompositeDisposable();
      // The backend has a different contract for streams (i.e. request-> n responscse) as it does with request-response (request->single response) thus the differet method here to support this.
      // It works like this: client creates a temp topic, we perform a RPC to then tell the backend to push to this topic.
      // TBH this is a bit odd as the server needs to handle fanout and we don't have any really control over the attributes of the topic, however for v1 demoland this is currently sufficient,
      // What's important here for now is we can bury this logic deep in the client, expose a consistent API which could be swapped out later.
      // An alternative could be achieved by having well known endpoints for pub sub, and request reploy, let the server manage them.
      // Server could push to these with a filter, or routing key allowing the infrastructure to handle fanout, persistance, all the usual messaging middleware concerns.
      // We could also wrap all messages in a wrapper envelope.
      // Such an envelope could denote if the message stream should terminate, for request respone this would be after the first message, for stream it would be when ever the server says so.
      let topicName = 'topic_' + _this._serviceType + '_' + (Math.random() * Math.pow(36, 8) << 0).toString(36);
      let hasSubscribed = false;
      disposables.add(_this._serviceInstanceDictionaryStream
        .getServiceWithMinLoad()
        .subscribe(serviceInstanceStatus => {
            if (!serviceInstanceStatus.isConnected) {
              o.onError(new Error('Disconnected'));
            } else if (!hasSubscribed) {
              hasSubscribed = true;
              _this._log.debug(`Will use service instance [${serviceInstanceStatus.serviceId}] for stream operation. IsConnected: [${serviceInstanceStatus.isConnected}]`);
              disposables.add(_this._connection
                .subscribeToTopic(topicName)
                .subscribe(
                  i => o.onNext(i),
                  err => {
                    o.onError(err);
                  },
                  () => {
                    o.onCompleted();
                  }
                )
              );
              let remoteProcedure:String = serviceInstanceStatus.serviceId + '.' + operationName;
              disposables.add(
                _this._connection.requestResponse(remoteProcedure, request, topicName).subscribe(
                  _ => {
                    _this._log.debug(`Ack received for stream operation [${operationName}]`);
                  },
                  err => {
                    o.onError(err);
                  },
                  () => {
                    // noop, nothing to do here, we don't complete the outter observer on ack
                  }
                )
              );
            }
          },
          err => {
            o.onError(err);
          },
          () => {
            o.onCompleted();
          }
        ));
      return disposables;
    });
  }

  _createServiceStatus(cache:LastValueObservableDictionary):ServiceStatus {
    let serviceInstanceStatuses : Array<ServiceInstanceStatus> = _.values(cache.values).map((item:LastValueObservable<ServiceInstanceStatus>) => item.latestValue);
    let isConnected : Boolean = _(cache.values).some((item:LastValueObservable<ServiceInstanceStatus>) => item.latestValue.isConnected);
    return new ServiceStatus(this._serviceType, serviceInstanceStatuses, isConnected);
  }
}
