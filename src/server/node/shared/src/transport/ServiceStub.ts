import { Observable, Subscription } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { WsConnection } from './WsConnection'

const LOG_NAME = 'Connection:'

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

  private logResponse(topic: string, response: {}): void {
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
    return this.connection.streamEndpoint
      .watch(`/exchange/${topic}`)
      .pipe(map(message => JSON.parse(message.body)))
  }

  /**
   * wraps a RPC up as an observable stream
   */
  requestResponse<TResponse, TPayload>(
    remoteProcedure: string,
    payload: TPayload
  ): Observable<TResponse> {
    console.info(LOG_NAME, `Creating request response operation for [${remoteProcedure}]`)

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
        tap(message =>
          this.logResponse(remoteProcedure, { headers: message.headers, body: message.body })
        ),
        map(message => JSON.parse(message.body))
      )
  }

  replyToRequestResponse<TResponse, TPayload>(
    remoteProcedure: string,
    handler: (payload: TPayload) => Promise<TResponse>
  ): Subscription {
    return this.connection.streamEndpoint.watch(`/queue/${remoteProcedure}`).subscribe(request => {
      const replyTo = request.headers['reply-to']
      const correlationId = request.headers['correlation-id']
      const payload = JSON.parse(request.body) as TPayload
      handler(payload).then(result => {
        const response = JSON.stringify(result)
        this.logResponse(
          remoteProcedure,
          'RPC Server: Response: ' + response + ' for ' + request.body
        )
        this.connection.streamEndpoint.publish({
          destination: replyTo,
          body: response,
          headers: { 'correlation-id': correlationId },
        })
      })
    })
  }

  requestStream<TResponse, TPayload = {}>(
    remoteProcedure: string,
    payload: TPayload
  ): Observable<TResponse> {
    console.log(`subscribing to RPC stream ${remoteProcedure}`)
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
        tap(message =>
          this.logResponse(remoteProcedure, {
            headers: message.headers,
            body: message.body,
          })
        ),
        map(message => JSON.parse(message.body))
      )
  }
}
