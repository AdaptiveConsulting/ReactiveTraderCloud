import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { WsConnection } from './WsConnection'

const LOG_NAME = 'ServiceClient: Initiated'

//  The format the server accepts

interface SubscriptionDTO<TPayload> {
  payload: TPayload
  Username: string
}

/**
 * A stub Used to call services. Hides the complexity of server interactions
 */
export class ServiceStub {
  constructor(private readonly userName: string, private connection: WsConnection) {}

  private logResponse(topic: string, response: any): void {
    const payloadString = JSON.stringify(response)
    if (topic !== 'status') {
      console.debug(LOG_NAME, `Received response on topic [${topic}]. Payload[${payloadString}]`)
    }
  }

  /**
   * Get an observable subscription to a well known topic/stream
   * @param topic
   * @param acknowledgementObs
   * @returns {Observable}
   */
  subscribeToTopic<TResponse>(topic: string): Observable<TResponse> {
    return this.connection.streamEndpoint.watch(`/exchange/${topic}`).pipe(
      tap(x => this.logResponse(topic, { headers: x.headers, body: x.body })),
      map(x => JSON.parse(x.body) as TResponse),
    )
  }

  /**
   * wraps a RPC up as an observable stream
   */
  createRequestResponseOperation<TResponse, TPayload>(
    service: string,
    operationName: string,
    payload: TPayload,
  ): Observable<TResponse> {
    console.info(LOG_NAME, `Creating request response operation for [${operationName}]`)

    const remoteProcedure = service + '.' + operationName
    const dto: SubscriptionDTO<TPayload> = {
      payload,
      Username: this.userName,
    }

    return this.connection.rpcEndpoint
      .rpc({
        destination: `/amq/queue/${remoteProcedure}`,
        body: JSON.stringify(dto),
      })
      .pipe(
        tap(x => this.logResponse(remoteProcedure, { headers: x.headers, body: x.body })),
        map(x => JSON.parse(x.body) as TResponse),
      )
  }

  createStreamOperation<TResponse, TPayload = {}>(
    service: string,
    operationName: string,
    payload: TPayload,
  ): Observable<TResponse> {
    const remoteProcedure = `${service}.${operationName}`
    console.log(`subscriping to RPC stream ${remoteProcedure}`)
    const dto: SubscriptionDTO<TPayload> = {
      payload,
      Username: this.userName,
    }

    return this.connection.rpcEndpoint
      .stream({
        destination: `/amq/queue/${remoteProcedure}`,
        body: JSON.stringify(dto),
      })
      .pipe(
        tap(x => this.logResponse(remoteProcedure, { headers: x.headers, body: x.body })),
        map(x => JSON.parse(x.body) as TResponse),
      )
  }
}
