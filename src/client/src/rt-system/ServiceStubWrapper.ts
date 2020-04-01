import { Observable } from 'rxjs'
import { share, map, tap, switchMap, distinctUntilChanged, filter } from 'rxjs/operators'
import { IServiceStatusCollection } from './ServiceInstanceCollection'
import { ServiceStub } from './ServiceStub'

/**
 * Abstracts a back end service for which there can be multiple instances.
 * Offers functionality to perform request-response and stream operations against a service instance.
 * Exposes a connection status stream that gives a summary of all service instances of available for this ServiceClient.
 */
const LOG_NAME = 'ServiceClient: Initiated'

export default class ServiceStubWrapper {
  constructor(
    private connection: ServiceStub,
    private readonly serviceInstanceDictionaryStream: Observable<IServiceStatusCollection>,
  ) {}

  private getServiceNumberOfInstances$(serviceType: string): Observable<number> {
    return this.serviceInstanceDictionaryStream.pipe(
      map(serviceCollectionMap => serviceCollectionMap.getServiceNumberOfInstances(serviceType)!),
      distinctUntilChanged((last, next) => last === next),
    )
  }

  /**
   * Gets a request-response observable that will act against a service which currently has the min load
   *
   */
  createRequestResponseOperation<TResponse, TRequest>(
    service: string,
    operationName: string,
    request: TRequest,
  ) {
    console.info(LOG_NAME, `Creating request response operation for [${operationName}]`)
    const remoteProcedure = service + '.' + operationName

    return this.connection
      .requestResponse<TResponse, TRequest>(remoteProcedure, request)
      .pipe(share())
  }

  /**
   * Gets a request-responses observable that will act against a service which currently has the min load
   */
  createStreamOperation<TResponse, TRequest = {}>(
    service: string,
    operationName: string,
    request: TRequest,
  ) {
    console.info(LOG_NAME, `Call [${service}] for stream operation [${operationName}]`)

    // The backend has a different contract for streams (i.e. request-> n responses) as it does with request-response (request->single response) thus
    // the different method here to support this.
    // It works like this: client creates a temp topic, we perform a RPC to then tell the backend to push to this topic.
    // TBH this is a bit odd as the server needs to handle fanout and we don't have any real control over the attributes of the topic, however it's sufficient for our needs now.
    // An alternative could be achieved by having well known endpoints for pub-sub, and request-response, const the server manage them.
    // Server could push to these with a filter, or routing key allowing the infrastructure to handle fanout, persistence, all the usual messaging middleware concerns.
    // Another approach we can incorporate would be to wrap all messages in a wrapper envelope.
    // Such an envelope could denote if the message stream should terminate, this would negate the need to distinguish between
    // tslint:disable-next-line:no-bitwise
    return this.getServiceNumberOfInstances$(service).pipe(
      filter(numberOfInstances => numberOfInstances > 0),
      tap(numberOfInstances =>
        console.log(
          `serviceStatus received ${service} is connected with ${numberOfInstances} nodes`,
        ),
      ),
      switchMap(() => {
        const remoteProcedure = `${service}.${operationName}`
        return this.connection.requestStream<TResponse, TRequest>(remoteProcedure, request)
      }),
    )
  }
}
