import { defer, Observable } from 'rxjs'
import { distinctUntilChanged, filter, map, share, switchMap, take } from 'rxjs/operators'
import { IServiceStatusCollection } from './ServiceInstanceCollection'
import { ServiceStub } from './ServiceStub'

/**
 * Abstracts a back end service for which there can be multiple instances.
 * Offers functionality to perform request-response and stream operations against a service instance.
 * Exposes a connection status stream that gives a summary of all service instances of available for this ServiceClient.
 */

const LOG_NAME = 'ServiceClient: Initiated'

export default class ServiceStubWithLoadBalancer {
  constructor(
    private connection: ServiceStub,
    private readonly serviceInstanceDictionaryStream: Observable<IServiceStatusCollection>,
  ) {}

  private getServiceWithMinLoad$(serviceType: string) {
    return this.serviceInstanceDictionaryStream.pipe(
      filter(serviceCollectionMap => !!serviceCollectionMap.getServiceInstanceWithMinimumLoad(serviceType)),
      map(serviceCollectionMap => serviceCollectionMap.getServiceInstanceWithMinimumLoad(serviceType)!),
      distinctUntilChanged((last, next) => last.serviceId === next.serviceId),
      take(1),
    )
  }

  /**
   * Gets a request-response observable that will act against a service which currently has the min load
   *
   */
  createRequestResponseOperation<TResponse, TRequest>(service: string, operationName: string, request: TRequest) {
    console.info(LOG_NAME, `Creating request response operation for [${operationName}]`)

    return this.getServiceWithMinLoad$(service).pipe(
      switchMap(serviceInstanceStatus => {
        if (serviceInstanceStatus.serviceId !== 'status') {
          console.info(
            LOG_NAME,
            `Will use service instance [${
              serviceInstanceStatus.serviceId
            }] for request/response operation [${operationName}]. IsConnected: [${serviceInstanceStatus.isConnected}]`,
          )
        }

        const remoteProcedure = serviceInstanceStatus.serviceId + '.' + operationName

        return this.connection.requestResponse<TResponse, TRequest>(remoteProcedure, request)
      }),
      share(),
    )
  }

  static generateTopicName = (service: string) =>
    `topic_${service}_${
      // tslint:disable-next-line:no-bitwise
      ((Math.random() * Math.pow(36, 8)) << 0).toString(36)
    }`
  /**
   * Gets a request-responses observable that will act against a service which currently has the min load
   */
  createStreamOperation<TResponse, TRequest = {}>(
    service: string,
    operationName: string,
    request: TRequest,
    topicGenerator = ServiceStubWithLoadBalancer.generateTopicName,
  ) {
    return defer(() =>
      this.getServiceWithMinLoad$(service).pipe(
        switchMap(serviceInstanceStatus => {
          return new Observable<TResponse>(obs => {
            // The backend has a different contract for streams (i.e. request-> n responses) as it does with request-response (request->single response) thus
            // the different method here to support this.
            // It works like this: client creates a temp topic, we perform a RPC to then tell the backend to push to this topic.
            // TBH this is a bit odd as the server needs to handle fanout and we don't have any real control over the attributes of the topic, however it's sufficient for our needs now.
            // An alternative could be achieved by having well known endpoints for pub-sub, and request-response, const the server manage them.
            // Server could push to these with a filter, or routing key allowing the infrastructure to handle fanout, persistence, all the usual messaging middleware concerns.
            // Another approach we can incorporate would be to wrap all messages in a wrapper envelope.
            // Such an envelope could denote if the message stream should terminate, this would negate the need to distinguish between
            // tslint:disable-next-line:no-bitwise

            const topicName = topicGenerator(service)

            console.info(
              LOG_NAME,
              `Will use service instance [${
                serviceInstanceStatus.serviceId
              }] for stream operation [${operationName}]. IsConnected: [${serviceInstanceStatus.isConnected}]`,
            )

            const remoteProcedure = `${serviceInstanceStatus.serviceId}.${operationName}`

            // tslint:disable-next-line:no-bitwise
            const subscribeTopic$ = this.connection.subscribeToTopic<TResponse>(topicName, {
              next: topic => {
                console.info(LOG_NAME, `Subscribed to ${topic}, requesting ${remoteProcedure}`)
                const req = this.connection
                  .requestResponse<TResponse, {}>(remoteProcedure, request, topicName)
                  .pipe(take(1))
                  .subscribe(() => {
                    console.info(LOG_NAME, `request acknowledged for ${remoteProcedure}`)
                    req.unsubscribe()
                  })
              },
            })

            // There must be a way to do this without an inner-subsribe
            const subscription = subscribeTopic$.subscribe(obs)

            const detectInstanceTimout = this.serviceInstanceDictionaryStream
              .pipe(
                map(currentStatus => currentStatus.getServiceInstanceStatus(service, serviceInstanceStatus.serviceId)),
                filter(currentStatus => !(currentStatus && currentStatus.isConnected)),
              )
              .subscribe(() => console.log('Topic timed out: ' + topicName))

            return () => {
              subscription.unsubscribe()
              detectInstanceTimout.unsubscribe()
            }
          })
        }),
      ),
    ).pipe(share())
  }
}
