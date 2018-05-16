import { Error, ISubscription } from 'autobahn'
import { NextObserver, Observable, Subscription, timer } from 'rxjs'
import {
  filter,
  mergeMap,
  multicast,
  publishReplay,
  refCount,
  switchMap,
  take
} from 'rxjs/operators'

import { ReplaySubject } from 'rxjs/ReplaySubject'
import logger from '../logger'
import { AutobahnConnection } from './AutoBahnConnection'
import AutobahnConnectionProxy from './autobahnConnectionProxy'
import './AutoBahnTypeExtensions'
import {
  ConnectionEvent,
  ConnectionEventType,
  ConnectionOpenEvent,
  createConnection$
} from './ConnectionFactory'

const log = logger.create('Connection')

//  The format the server accepts

interface SubscriptionDTO<TPayload> {
  payload: TPayload
  replyTo: string
  Username: string
}

type SubscriptionRequest<TPayload> = Array<SubscriptionDTO<TPayload>>

export default function createConnection(
  userName: string,
  url: string,
  realm: string,
  port: number
): Connection {
  const autobahn = new AutobahnConnectionProxy(url, realm, port)
  return new Connection(userName, autobahn)
}

/**
 * Represents a Connection to autobahn
 */
export class Connection {
  private readonly userName: string
  private autobahn: AutobahnConnection
  public connectionStream: Observable<ConnectionEvent>

  constructor(userName: string, autobahn: AutobahnConnection) {
    this.userName = userName
    this.autobahn = autobahn

    this.connectionStream = createConnection$(this.autobahn).pipe(
      multicast(() => {
        return new ReplaySubject<ConnectionEvent>(1)
      }),
      refCount()
    )
  }

  logResponse(topic: string, response: any[]): void {
    const payloadString = JSON.stringify(response[0])
    if (topic !== 'status') {
      log.verbose(
        `Received response on topic [${topic}]. Payload[${payloadString}]`
      )
    }
  }

  /**
   * Get an observable subscription to a well known topic/stream
   * @param topic
   * @param acknowledgementObs
   * @returns {Observable}
   */
  subscribeToTopic<T>(
    topic: string,
    acknowledgementObs?: NextObserver<string>
  ): Observable<T> {
    return this.connectionStream.pipe(
      filter(
        (connection): connection is ConnectionOpenEvent =>
          connection.type === ConnectionEventType.CONNECTED
      ),
      switchMap(
        ({ session }) =>
          new Observable<T>(obs => {
            log.info(`Subscribing to topic [${topic}].`)

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
                  log.error(`Error on topic ${topic}`, error)
                  obs.error(error)
                }
              )

            return () => {
              log.info(`Tearing down topic ${topic}`)

              if (!subscription) {
                return
              }
              try {
                if (session && session.isOpen()) {
                  session.unsubscribe(subscription).then(
                    () => {
                      obs.complete()

                      //obs.unsubscribe()
                      return log.info(
                        `Successfully unsubscribing from topic ${topic}`
                      )
                    },
                    err =>
                      log.error(`Error unsubscribing from topic ${topic}`, err)
                  )
                }
              } catch (err) {
                log.error(`Error thrown unsubscribing from topic ${topic}`, err)
              }
            }
          })
      )
    )
  }

  /**
   * wraps a RPC up as an observable stream
   */

  requestResponse<TResult, TPayload>(
    remoteProcedure: string,
    payload: TPayload,
    responseTopic: string = ''
  ) {
    return this.connectionStream.pipe(
      filter(
        (connection): connection is ConnectionOpenEvent =>
          connection.type === ConnectionEventType.CONNECTED
      ),
      mergeMap(
        ({ session }) =>
          new Observable<TResult>(obs => {
            log.debug(`Doing a RPC to [${remoteProcedure}]]`)

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
