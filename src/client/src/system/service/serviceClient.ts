import { Observable } from 'rxjs'
import { filter, first, map, mergeMap } from 'rxjs/operators'
import { ServiceConst } from '../../types/'
import logger, { Logger } from '../logger'
import { Connection } from './connection'
import { ServiceCollectionMap } from './ServiceInstanceCollection'

/**
 * Abstracts a back end service for which there can be multiple instances.
 * Offers functionality to perform request-response and stream operations against a service instance.
 * Exposes a connection status stream that gives a summary of all service instances of available for this ServiceClient.
 */

export default class ServiceClient {
  private readonly log: Logger

  constructor(
    private connection: Connection,
    private readonly serviceInstanceDictionaryStream: Observable<
      ServiceCollectionMap
    >
  ) {
    this.log = logger.create(`ServiceClient: Initiated`)
  }

  private getServiceWithMinLoad$(serviceType: string) {
    return this.serviceInstanceDictionaryStream.pipe(
      filter(
        serviceCollectionMap =>
          !!serviceCollectionMap.getServiceInstanceWithMinimumLoad(serviceType)
      ),
      map(
        serviceCollectionMap =>
          serviceCollectionMap.getServiceInstanceWithMinimumLoad(serviceType)!
      )
    )
  }

  /**
   * Gets a request-response observable that will act against a service which currently has the min load
   *
   */
  createRequestResponseOperation<TResponse, TRequest>(
    service: string,
    operationName: string,
    request: TRequest
  ) {
    this.log.info(`Creating request response operation for [${operationName}]`)

    return this.getServiceWithMinLoad$(service).pipe(
      first(),
      mergeMap(serviceInstanceStatus => {
        if (serviceInstanceStatus.serviceId !== 'status') {
          this.log.info(
            `Will use service instance [${
              serviceInstanceStatus.serviceId
            }] for request/response operation [${operationName}]. IsConnected: [${
              serviceInstanceStatus.isConnected
            }]`
          )
        }

        const remoteProcedure =
          serviceInstanceStatus.serviceId + '.' + operationName

        return this.connection.requestResponse<TResponse, TRequest>(
          remoteProcedure,
          request
        )
      })
    )
  }

  /**
   * Gets a request-responses observable that will act against a service which currently has the min load
   */
  createStreamOperation<TResponse, TRequest = {}>(
    service: ServiceConst,
    operationName: string,
    request: TRequest
  ) {
    return this.getServiceWithMinLoad$(service).pipe(
      first(),
      mergeMap(serviceInstanceStatus => {
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

        const topicName = `topic_${service}_${
          // tslint:disable-next-line:no-bitwise
          ((Math.random() * Math.pow(36, 8)) << 0).toString(36)
        }`

        this.log.info(
          `Will use service instance [${
            serviceInstanceStatus.serviceId
          }] for stream operation [${operationName}]. IsConnected: [${
            serviceInstanceStatus.isConnected
          }]`
        )

        const remoteProcedure = `${
          serviceInstanceStatus.serviceId
        }.${operationName}`

        // tslint:disable-next-line:no-bitwise
        const subscribeTopic$ = this.connection.subscribeToTopic<TResponse>(
          topicName,
          {
            next: topic => {
              this.log.info(
                `Subscribed to ${topic}, requesting ${remoteProcedure}`
              )
              this.connection
                .requestResponse<TResponse, {}>(
                  remoteProcedure,
                  request,
                  topicName
                )
                .subscribe(ack => {
                  this.log.info(`request acknowledged for ${remoteProcedure}`)
                })
            }
          }
        )

        return subscribeTopic$
      })
    )
  }
}
