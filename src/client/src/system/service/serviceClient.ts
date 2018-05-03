import {
  BehaviorSubject,
  ConnectableObservable,
  Observable,
  Scheduler,
  Subscription
} from 'rxjs'
import {
  catchError,
  filter,
  groupBy,
  map,
  merge,
  mergeMapTo,
  multicast,
  publish,
  refCount,
  repeat,
  share,
  take
} from 'rxjs/operators'
import {
  ConnectionStatus,
  ServiceInstanceStatus,
  ServiceStatus
} from '../../types/'
import { RawServiceStatus } from '../../types/serviceInstanceStatus'
import { DisposableBase } from '../disposables'
import logger, { Logger } from '../logger'
import { Connection } from './connection'
import LastValueObservableDictionary from './lastValueObservableDictionary'
import {
  debounceOnMissedHeartbeat,
  distinctUntilChangedGroup,
  getServiceWithMinLoad,
  toServiceStatusObservableDictionary
} from './operators'

/**
 * Abstracts a back end service for which there can be multiple instances.
 * Offers functionality to perform request-response and stream operations against a service instance.
 * Exposes a connection status stream that gives a summary of all service instances of available for this ServiceClient.
 */

export default class ServiceClient extends DisposableBase {
  private readonly log: Logger
  private readonly serviceType: string
  private readonly serviceInstanceDictionaryStream: ConnectableObservable<
    LastValueObservableDictionary<ServiceInstanceStatus>
  >
  public isConnectCalled: boolean = false
  private readonly connection: Connection

  static HEARTBEAT_TIMEOUT = 3000

  constructor(serviceType: string, connection: Connection) {
    super()

    this.log = logger.create(`ServiceClient:${serviceType}`)
    this.serviceType = serviceType
    this.connection = connection
    // create a connectible observable that yields a dictionary of connection status for
    // each service we're getting heartbeats from .
    // The dictionary support querying by service load, handy when we kick off new operations.
    this.serviceInstanceDictionaryStream = this.createServiceInstanceDictionaryStream(
      serviceType
    ).pipe(
      multicast(
        new BehaviorSubject(
          new LastValueObservableDictionary<ServiceInstanceStatus>()
        )
      )
    ) as ConnectableObservable<
      LastValueObservableDictionary<ServiceInstanceStatus>
    >
  }

  /**
   * Sits on top of our underlying dictionary stream exposing a summary of the connection and services instance for this service client
   */
  get serviceStatusStream() {
    return this.serviceInstanceDictionaryStream.pipe(
      map(cache => createServiceStatus(cache, this.serviceType)),
      publish<ServiceStatus>(),
      refCount()
    )
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
   */
  createServiceInstanceDictionaryStream(currentServiceType: string) {
    return new Observable<LastValueObservableDictionary<ServiceInstanceStatus>>(
      obs => {
        const connectionStatus$ = this.connection.connectionStatusStream.pipe(
          map(status => status === ConnectionStatus.connected),
          share()
        )

        const onConnection$ = connectionStatus$.pipe(
          filter(connected => connected)
        )

        const errorOnDisconnect$ = connectionStatus$.pipe(
          filter(connected => !connected),
          take(1),
          mergeMapTo(Observable.throw('Underlying connection disconnected'))
        )

        const serviceInstanceDictionary$ = this.connection
          .subscribeToTopic<RawServiceStatus>('status')
          .pipe(
            filter(serviceStatus => serviceStatus.Type === currentServiceType),
            map(convertServiceMesage),
            merge<ServiceInstanceStatus>(errorOnDisconnect$),
            // If the underlying connection goes down we error the stream.
            // Do this before the grouping so all grouped streams error.
            groupBy(serviceStatus => serviceStatus.serviceId),
            debounceOnMissedHeartbeat(
              ServiceClient.HEARTBEAT_TIMEOUT,
              serviceId =>
                createServiceInstanceForDisconnected(
                  currentServiceType,
                  serviceId
                ),
              Scheduler.async
            ),
            // create a hash of properties which represent significant change in a status, we'll use this to filter out duplicates
            distinctUntilChangedGroup<ServiceInstanceStatus>(
              (status, statusNew) =>
                status.isConnected === statusNew.isConnected &&
                status.serviceLoad === statusNew.serviceLoad
            ),
            // flattens all our service instances stream into an observable dictionary so we query the service with the least load on a per-subscribe basis
            toServiceStatusObservableDictionary(
              serviceStatus => serviceStatus.serviceId
            ),
            // catch the disconnect error of the outer stream and continue with an empty (thus disconnected) dictionary

            catchError(() =>
              Observable.of(
                new LastValueObservableDictionary<ServiceInstanceStatus>()
              )
            )
          )

        // When we are connected for the first time we start listening to `serviceInstanceDictionary$`
        // repeat after disconnects

        return onConnection$
          .pipe(take(1), mergeMapTo(serviceInstanceDictionary$), repeat())
          .subscribe(obs)
      }
    )
  }

  /**
   * Gets a request-response observable that will act against a service which currently has the min load
   *
   */
  createRequestResponseOperation<TResponse, TRequest>(
    operationName: string,
    request: TRequest,
    waitForSuitableService = false
  ) {
    return new Observable<TResponse>(obs => {
      this.log.debug(
        `Creating request response operation for [${operationName}]`
      )

      const disposables = new Subscription()

      let hasSubscribed = false

      disposables.add(
        this.serviceInstanceDictionaryStream
          .pipe(getServiceWithMinLoad(waitForSuitableService))
          .subscribe(
            serviceInstanceStatus => {
              if (!serviceInstanceStatus.isConnected) {
                obs.error(
                  new Error(
                    'Service instance is disconnected for request response operation'
                  )
                )
              } else if (!hasSubscribed) {
                hasSubscribed = true
                this.log.debug(
                  `Will use service instance [${
                    serviceInstanceStatus.serviceId
                  }] for request/response operation [${operationName}]. IsConnected: [${
                    serviceInstanceStatus.isConnected
                  }]`
                )
                const remoteProcedure =
                  serviceInstanceStatus.serviceId + '.' + operationName
                disposables.add(
                  this.connection
                    .requestResponse<TResponse, TRequest>(
                      remoteProcedure,
                      request
                    )
                    .subscribe(
                      response => {
                        this.log.debug(
                          `Response received for stream operation [${operationName}]`
                        )
                        obs.next(response)
                      },
                      err => obs.error(err),
                      () => obs.complete()
                    )
                )
              }
            },
            err => obs.error(err),
            () => obs.complete()
          )
      )
      return disposables
    })
  }

  /**
   * Gets a request-responses observable that will act against a service which currently has the min load
   */
  createStreamOperation<TResponse, TRequest = {}>(
    operationName: string,
    request: TRequest
  ) {
    return new Observable<TResponse>(obs => {
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
      const topicName = `topic_${this.serviceType}_${
        // tslint:disable-next-line:no-bitwise
        ((Math.random() * Math.pow(36, 8)) << 0).toString(36)
      }`

      let hasSubscribed = false

      disposables.add(
        this.serviceInstanceDictionaryStream
          .pipe(getServiceWithMinLoad())
          .subscribe(
            serviceInstanceStatus => {
              if (!serviceInstanceStatus.isConnected) {
                obs.error(
                  new Error(
                    'Service instance is disconnected for stream operation'
                  )
                )
              } else if (!hasSubscribed) {
                hasSubscribed = true
                this.log.debug(
                  `Will use service instance [${
                    serviceInstanceStatus.serviceId
                  }] for stream operation [${operationName}]. IsConnected: [${
                    serviceInstanceStatus.isConnected
                  }]`
                )
                disposables.add(
                  this.connection
                    .subscribeToTopic<TResponse>(topicName)
                    .subscribe(
                      response => {
                        obs.next(response)
                      },
                      err => {
                        obs.error(err)
                      },
                      () => {
                        obs.complete()
                      }
                    )
                )
                const remoteProcedure = `${
                  serviceInstanceStatus.serviceId
                }.${operationName}`

                disposables.add(
                  this.connection
                    .requestResponse(remoteProcedure, request, topicName)
                    .subscribe(
                      () => {
                        this.log.debug(
                          `Ack received for RPC hookup as part of stream operation [${operationName}]`
                        )
                      },
                      err => obs.error(err),
                      () => {} // noop, nothing to do here, we don't complete the outer observer on ack,
                    )
                )
              }
            },
            error => obs.error(error),
            () => obs.complete()
          )
      )
      return disposables
    })
  }
}

function createServiceStatus(
  cache: LastValueObservableDictionary<ServiceInstanceStatus>,
  serviceType: string
): ServiceStatus {
  const values = cache.getValues()

  const instanceStatuses = values.map(item => item.latestValue)
  const connected = values.some(item => item.latestValue.isConnected)

  return {
    isConnected: connected,
    instanceStatuses,
    serviceType
  }
}

function convertServiceMesage(
  serviceStatus: RawServiceStatus
): ServiceInstanceStatus {
  return {
    serviceType: serviceStatus.Type,
    serviceId: serviceStatus.Instance,
    timestamp: serviceStatus.TimeStamp,
    serviceLoad: serviceStatus.Load,
    isConnected: true
  }
}

function createServiceInstanceForDisconnected(
  serviceType: string,
  serviceId: string
): ServiceInstanceStatus {
  return {
    serviceType,
    serviceId,
    timestamp: NaN,
    serviceLoad: NaN,
    isConnected: false
  }
}
