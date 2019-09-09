import { Error, ISubscription } from 'autobahn'
import { NextObserver, Observable } from 'rxjs'
import { filter, switchMap, take } from 'rxjs/operators'
import logger from '../logger'
import './AutoBahnTypeExtensions'
import { ConnectionEvent, ConnectionEventType, ConnectionOpenEvent } from './connectionStream'

const LOG_NAME = 'Connection:'

//  The format the server accepts

interface SubscriptionDTO<TPayload> {
  payload: TPayload
  Username: string
  replyTo: string
}

type SubscriptionRequest<TPayload> = Array<SubscriptionDTO<TPayload>>

/**
 * A stub Used to call services. Hides the complexity of server interactions
 */
export class ServiceStub {
  constructor(private readonly userName: string, private connection$: Observable<ConnectionEvent>) {}

  /**
   * Get an observable subscription to a well known topic/stream
   * @param topic
   * @param acknowledgementObs
   * @returns {Observable}
   */
  subscribeToTopic<T>(topic: string, acknowledgementObs?: NextObserver<string>): Observable<T> {
    return this.connection$.pipe(
      filter((connection): connection is ConnectionOpenEvent => connection.type === ConnectionEventType.CONNECTED),
      switchMap(
        ({ session }) =>
          new Observable<T>(obs => {
            logger.info(`${LOG_NAME} Subscribing to topic [${topic}].`)

            let subscription: ISubscription

            session
              .subscribe<T>(topic, response => {
                this.logResponse(topic, response)
                obs.next(response[0])
              })
              .then(
                sub => {
                  // subscription succeeded, subscription is an instance of autobahn.Subscription
                  if (acknowledgementObs) {
                    acknowledgementObs.next(topic)
                  }
                  subscription = sub
                },
                (error: Error) => {
                  // subscription failed, error is an instance of autobahn.Error
                  logger.error(`${LOG_NAME} Error on topic ${topic}`, error)
                  obs.error(error)
                },
              )

            return () => {
              logger.info(`${LOG_NAME} Tearing down topic ${topic}`)

              if (!subscription) {
                return
              }
              try {
                if (session && session.isOpen()) {
                  // It appears that AutoBahn's unsubscribe function is not implemented properly. In the case of an internal websocket exception,
                  // due to disconnection for example, the promise that is returned never completes; i.e., neither callback passed to `then` is
                  // ever invoked. I would at least have expected the rejected callback to have been invoked with the error. -D.S.
                  session
                    .unsubscribe(subscription)
                    .then(
                      () => logger.info(`${LOG_NAME} Successfully unsubscribing from topic ${topic}`),
                      err => logger.error(`${LOG_NAME} Error unsubscribing from topic ${topic}`, err),
                    )
                }
              } catch (err) {
                logger.error(`${LOG_NAME} Error thrown unsubscribing from topic ${topic}`, err)
              }
            }
          }),
      ),
    )
  }

  requestResponse<TResult, TPayload>(remoteProcedure: string, payload: TPayload, responseTopic: string = '') {
    return this.connection$.pipe(
      filter((connection): connection is ConnectionOpenEvent => connection.type === ConnectionEventType.CONNECTED),
      switchMap(
        ({ session }) =>
          new Observable<TResult>(obs => {
            logger.info(LOG_NAME, `Doing a RPC to [${remoteProcedure}]]`)

            const dto: SubscriptionRequest<TPayload> = [
              {
                payload,
                replyTo: responseTopic,
                Username: this.userName,
              },
            ]

            session.call<TResult>(remoteProcedure, dto).then(
              result => {
                obs.next(result)
                obs.complete()
              },
              error => {
                obs.error(error)
              },
            )
          }),
      ),
      take(1),
    )
  }

  private logResponse(topic: string, response: any[]): void {
    const payloadString = JSON.stringify(response[0])
    if (topic !== 'status') {
      logger.debug(LOG_NAME, `Received response on topic [${topic}]. Payload[${payloadString}]`)
    }
  }
}
