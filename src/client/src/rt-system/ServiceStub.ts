import { Error, ISubscription } from 'autobahn'
import { NextObserver, Observable } from 'rxjs'
import { filter, mergeMap, switchMap } from 'rxjs/operators'

import './AutoBahnTypeExtensions'
import { ConnectionEvent, ConnectionEventType, ConnectionOpenEvent } from './connectionStream'

const LOG_NAME = 'Connection:'

//  The format the server accepts

interface SubscriptionDTO<TPayload> {
  payload: TPayload
  replyTo: string
  Username: string
}

type SubscriptionRequest<TPayload> = Array<SubscriptionDTO<TPayload>>

/**
 * A stub Used to call services. Hides the complexity of server interactions
 */
export class ServiceStub {
  constructor(private readonly userName: string, private connection$: Observable<ConnectionEvent>) {
    this.userName = userName
  }

  logResponse(topic: string, response: any[]): void {
    const payloadString = JSON.stringify(response[0])
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
  subscribeToTopic<T>(topic: string, acknowledgementObs?: NextObserver<string>): Observable<T> {
    return this.connection$.pipe(
      filter((connection): connection is ConnectionOpenEvent => connection.type === ConnectionEventType.CONNECTED),
      switchMap(
        ({ session }) =>
          new Observable<T>(obs => {
            console.info(LOG_NAME, `Subscribing to topic [${topic}].`)

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
                  console.error(LOG_NAME, `Error on topic ${topic}`, error)
                  obs.error(error)
                }
              )

            return () => {
              console.info(LOG_NAME, `Tearing down topic ${topic}`)

              if (!subscription) {
                return
              }
              try {
                if (session && session.isOpen()) {
                  session.unsubscribe(subscription).then(
                    () => {
                      obs.complete()

                      //obs.unsubscribe()
                      return console.info(LOG_NAME, `Successfully unsubscribing from topic ${topic}`)
                    },
                    err => console.error(LOG_NAME, `Error unsubscribing from topic ${topic}`, err)
                  )
                }
              } catch (err) {
                console.error(LOG_NAME, `Error thrown unsubscribing from topic ${topic}`, err)
              }
            }
          })
      )
    )
  }

  /**
   * wraps a RPC up as an observable stream
   */

  requestResponse<TResult, TPayload>(remoteProcedure: string, payload: TPayload, responseTopic: string = '') {
    return this.connection$.pipe(
      filter((connection): connection is ConnectionOpenEvent => connection.type === ConnectionEventType.CONNECTED),
      mergeMap(
        ({ session }) =>
          new Observable<TResult>(obs => {
            console.debug(LOG_NAME, `Doing a RPC to [${remoteProcedure}]]`)

            const dto: SubscriptionRequest<TPayload> = [
              {
                payload,
                replyTo: responseTopic,
                Username: this.userName
              }
            ]

            session.call<TResult>(remoteProcedure, dto).then(
              result => {
                obs.next(result)
                obs.complete()
              },
              error => {
                obs.error(error)
              }
            )

            return () => {
              obs.complete()
            }
          })
      )
    )
  }
}
