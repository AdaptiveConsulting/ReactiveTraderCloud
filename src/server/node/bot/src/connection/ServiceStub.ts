import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import logger from '../logger'
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
  createRequestResponseOperation<TResponse, TPayload>(
    service: string,
    operationName: string,
    payload: TPayload
  ): Observable<TResponse> {
    const dto: SubscriptionDTO<TPayload> = {
      payload,
      Username: this.userName,
    }
    const remoteProcedure = `${service}.${operationName}`

    logger.info(LOG_NAME, `Creating request response operation for [${remoteProcedure}]`)

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

  createStreamOperation<TResponse, TPayload = {}>(
    service: string,
    operationName: string,
    payload: TPayload
  ): Observable<TResponse> {
    const dto: SubscriptionDTO<TPayload> = {
      payload,
      Username: this.userName,
    }
    const remoteProcedure = `${service}.${operationName}`

    logger.info(`subscribing to RPC stream ${remoteProcedure}`)

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

  private logResponse(topic: string, response: {}): void {
    const payloadString = JSON.stringify(response)
    if (topic !== 'status') {
      logger.debug(LOG_NAME, `Received response on topic [${topic}]. Payload[${payloadString}]`)
    }
  }
}
