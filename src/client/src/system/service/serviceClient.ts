import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMapTo'
import 'rxjs/add/operator/repeat'
import { BehaviorSubject, Observable, Scheduler, Subscription } from 'rxjs/Rx'

import * as _ from 'lodash'
// Importing ServiceObservableExtensions to add functions to Rx prototype
import '../../../src/system/service/serviceObservableExtensions'
import { ConnectionStatus, ServiceInstanceStatus, ServiceStatus } from '../../types/'
import { DisposableBase } from '../disposables'
import Guard from '../guard'
import logger from '../logger'
import '../observableExtensions/retryPolicyExt'
import LastValueObservableDictionary from './lastValueObservableDictionary'

interface RawServiceStatus {
  Type: string,
  Instance: string,
  TimeStamp: number,
  Load: number,
}

const toConnectedBoolean = status => status === ConnectionStatus.connected
const isConnected = connected => connected
const isNotConnected = connected => !connected
const throwConnectionDisconnectedError = () => Observable.throw('Underlying connection disconnected')
const isCurrentServiceType = (currentServiceType: string) => (service: RawServiceStatus) => service.Type === currentServiceType

/**
 * Abstracts a back end service for which there can be multiple instances.
 * Offers functionality to perform request-response and stream operations against a service instance.
 * Exposes a connection status stream that gives a summary of all service instances of available for this ServiceClient.
 */

export default class ServiceClient extends DisposableBase {

  log
  serviceType
  serviceInstanceDictionaryStream
  isConnectCalled
  connection

  static get HEARTBEAT_TIMEOUT() {
    return 3000
  }

  constructor(serviceType, connection) {
    super()
    Guard.stringIsNotEmpty(serviceType, 'serviceType required and should not be empty')
    Guard.isDefined(connection, 'connection required')
    this.log = logger.create(`ServiceClient:${serviceType}`)
    this.serviceType = serviceType
    this.connection = connection
    // create a connectible observable that yields a dictionary of connection status for
    // each service we're getting heartbeats from .
    // The dictionary support querying by service load, handy when we kick off new operations.
    this.serviceInstanceDictionaryStream = this.createServiceInstanceDictionaryStream(serviceType)
      .multicast(new BehaviorSubject(new LastValueObservableDictionary()))
  }

  /**
   * Sits on top of our underlying dictionary stream exposing a summary of the connection and services instance for this service client
   *
   * @returns {Observable<T>}
   */
  get serviceStatusStream() {
    return this.serviceInstanceDictionaryStream
      .map(cache => createServiceStatus(cache, this.serviceType))
      .publish()
      .refCount()
  }

  // connects the underlying status observable
  connect() {
    if (!this.isConnectCalled) {
      this.isConnectCalled = true
      this.addDisposable(this.serviceInstanceDictionaryStream.connect())
    }
  }

  /**
   * Multiplexes the underlying connection status stream by service instance heartbeats, then wraps these up as
   * an observable dictionary which can be queried (for connection status and min load) on a per operation basis.
   * For example, first we listen to an underlying connection status of bool, when true, we subscribe
   * for service heartbeats, we group service heartbeats by serviceId and add service level heartbeat timeouts/debounce, finally
   * we wrap all the service instance streams into a dictionary like structure. This structure can be queried at subscribe
   * time to determine which service instance is connected and has minimum load for a given operation.
   * @param currentServiceType
   * @returns {Observable}
   * @private
   */
  createServiceInstanceDictionaryStream(currentServiceType) {
    return Observable.create(o => {
      // connectionStatus$ emits booleans
      const connectionStatus$ = this.connection.connectionStatusStream.map(toConnectedBoolean).share()
      const connectedConnection$ = connectionStatus$.filter(isConnected)
      const errorOnDisconnect$ = connectionStatus$.filter(isNotConnected).take(1).flatMap(throwConnectionDisconnectedError)
      const serviceInstanceDictionary$ = this.connection
        .subscribeToTopic('status')
        .filter(isCurrentServiceType(currentServiceType))
        .map(createServiceInstanceForConnected)
        // If the underlying connection goes down we error the stream.
        // Do this before the grouping so all grouped streams error.
        .merge(errorOnDisconnect$)
        .groupBy(serviceStatus => serviceStatus.serviceId)
        // add service instance level heartbeat timeouts, i.e. each service instance can disconnect independently
        .debounceOnMissedHeartbeat(ServiceClient.HEARTBEAT_TIMEOUT, serviceId => createServiceInstanceForDisconnected(currentServiceType, serviceId), Scheduler.async)
        // create a hash of properties which represent significant change in a status, we'll use this to filter out duplicates
        .distinctUntilChangedGroup((status, statusNew) => status.isConnected === statusNew.isConnected && status.serviceLoad === statusNew.serviceLoad)
        // flattens all our service instances stream into an observable dictionary so we query the service with the least load on a per-subscribe basis
        .toServiceStatusObservableDictionary(serviceStatus => serviceStatus.serviceId)
        // catch the disconnect error of the outer stream and continue with an empty (thus disconnected) dictionary
        .catch(() => Observable.of(new LastValueObservableDictionary()))
      return connectedConnection$
        .take(1)
        // When we are connected for the first time we start listening to `serviceInstanceDictionary$`
        .mergeMapTo(serviceInstanceDictionary$)
        // repeat after disconnects
        .repeat()
        .subscribe(o)
    })
  }

  /**
   * Gets a request-response observable that will act against a service which currently has the min load
   *
   * @param operationName
   * @param request
   * @param waitForSuitableService if true, will wait for a service to become available before requesting, else will error the stream
   * @returns {Observable}
   */
  createRequestResponseOperation(operationName, request, waitForSuitableService = false) {
    return Observable.create((o) => {
      this.log.debug(`Creating request response operation for [${operationName}]`)
      const disposables = new Subscription()
      let hasSubscribed = false
      disposables.add(this.serviceInstanceDictionaryStream
        .getServiceWithMinLoad(waitForSuitableService)
        .subscribe((serviceInstanceStatus) => {
          if (!serviceInstanceStatus.isConnected) {
            o.error(new Error('Service instance is disconnected for request response operation'))
          } else if (!hasSubscribed) {
            hasSubscribed = true
            this.log.debug(`Will use service instance [${serviceInstanceStatus.serviceId}] for request/response operation [${operationName}]. IsConnected: [${serviceInstanceStatus.isConnected}]`)
            const remoteProcedure = serviceInstanceStatus.serviceId + '.' + operationName
            disposables.add(
              this.connection.requestResponse(remoteProcedure, request).subscribe(
                (response) => {
                  this.log.debug(`Response received for stream operation [${operationName}]`)
                  o.next(response)
                },
                err => o.error(err),
                () => o.complete(),
              ),
            )
          }
        },
          err => o.error(err),
          () => o.complete(),
      ))
      return disposables
    })
  }

  /**
   * Gets a request-responses observable that will act against a service which currently has the min load
   *
   * @param operationName
   * @param request
   * @returns {Observable}
   */
  createStreamOperation(operationName, request) {
    return Observable.create((o) => {
      this.log.debug(`Creating stream operation for [${operationName}]`)
      const disposables = new Subscription()
      // The backend has a different contract for streams (i.e. request-> n responses) as it does with request-response (request->single response) thus
      // the different method here to support this.
      // It works like this: client creates a temp topic, we perform a RPC to then tell the backend to push to this topic.
      // TBH this is a bit odd as the server needs to handle fanout and we don't have any really control over the attributes of the topic, however it's sufficient for our needs now.
      // What's important here for now is we can bury this logic deep in the client, expose a consistent API which could be swapped out later.
      // An alternative could be achieved by having well known endpoints for pub-sub, and request-response, const the server manage them.
      // Server could push to these with a filter, or routing key allowing the infrastructure to handle fanout, persistence, all the usual messaging middleware concerns.
      // Another approach we can incorporate would be to wrap all messages in a wrapper envelope.
      // Such an envelope could denote if the message stream should terminate, this would negate the need to distinguish between
      // request-response and stream operations as is currently the case.
      // tslint:disable-next-line:no-bitwise
      const topicName = 'topic_' + this.serviceType + '_' + (Math.random() * Math.pow(36, 8) << 0).toString(36)
      let hasSubscribed = false
      disposables.add(this.serviceInstanceDictionaryStream
        .getServiceWithMinLoad()
        .subscribe((serviceInstanceStatus) => {
          if (!serviceInstanceStatus.isConnected) {
            o.error(new Error('Service instance is disconnected for stream operation'))
          } else if (!hasSubscribed) {
            hasSubscribed = true
            this.log.debug(`Will use service instance [${serviceInstanceStatus.serviceId}] for stream operation [${operationName}]. IsConnected: [${serviceInstanceStatus.isConnected}]`)
            disposables.add(this.connection
              .subscribeToTopic(topicName)
              .subscribe(
                i => o.next(i),
                err => {
                  o.error(err)
                },
                () => {
                  o.complete()
                },
            ),
            )
            const remoteProcedure = serviceInstanceStatus.serviceId + '.' + operationName
            disposables.add(
              this.connection.requestResponse(remoteProcedure, request, topicName)
                .subscribe(
                  () => {
                    this.log.debug(`Ack received for RPC hookup as part of stream operation [${operationName}]`)
                  },
                  err => o.error(err),
                  () => { }, // noop, nothing to do here, we don't complete the outer observer on ack,
              ),
            )
          }
        },
          error => o.error(error),
          () => o.complete(),
      ))
      return disposables
    })
  }
}

function createServiceStatus(cache, serviceType): ServiceStatus {
  const instanceStatuses = _.values(cache.values).map((item: any) => item.latestValue)
  const connected = _(cache.values).some((item: any) => item.latestValue.isConnected)
  return {
    isConnected: connected,
    instanceStatuses,
    serviceType,
  }
}

function createServiceInstanceForConnected(serviceStatus: RawServiceStatus): ServiceInstanceStatus {
  Guard.stringIsNotEmpty(serviceStatus.Type, 'serviceStatus.Type must be as string and not empty')
  Guard.stringIsNotEmpty(serviceStatus.Instance, 'serviceStatus.Instance must be as string and not empty')

  return {
    serviceType: serviceStatus.Type,
    serviceId: serviceStatus.Instance,
    timestamp: serviceStatus.TimeStamp,
    serviceLoad: serviceStatus.Load,
    isConnected: true,
  }
}

function createServiceInstanceForDisconnected(serviceType: string, serviceId: string): ServiceInstanceStatus {
  Guard.stringIsNotEmpty(serviceType, 'serviceType must be as string and not empty')
  Guard.stringIsNotEmpty(serviceId, 'serviceId must be as string and not empty')

  return {
    serviceType,
    serviceId,
    timestamp: NaN,
    serviceLoad: NaN,
    isConnected: false,
  }
}
