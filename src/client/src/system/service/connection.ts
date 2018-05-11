import { Error, ISubscription } from 'autobahn'
import { NextObserver, Observable, Subscription, timer } from 'rxjs'
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  publishBehavior,
  refCount,
  shareReplay
} from 'rxjs/operators'

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
import { ConnectionStatus } from './connectionStatus'
import { ConnectionType } from './connectionType'

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
  userName: string
  autobahn: AutobahnConnection
  connectionStatusSubject: Observable<ConnectionStatus>
  autoDisconnectDisposable?: Subscription
  connectionType: ConnectionType
  connectionUrl: string
  connectionStream: Observable<ConnectionEvent>

  constructor(userName: string, autobahn: AutobahnConnection) {
    this.userName = userName
    this.autobahn = autobahn
    this.connectionUrl = ''
    this.connectionType = ConnectionType.Unknown

    this.connectionStream = createConnection$(this.autobahn).pipe(
      shareReplay(1)
    )

    timer(Connection.DISCONNECT_SESSION_AFTER).subscribe(() => {
      this.autobahn.close()
    })

    this.connectionStatusSubject = this.connectionStream.pipe(
      map(x => {
        if (x.type === ConnectionEventType.CONNECTED) {
          return ConnectionStatus.connected
        } else {
          if (x.reason === 'closed') {
            return ConnectionStatus.sessionExpired
          } else {
            return ConnectionStatus.disconnected
          }
        }
      }),
      publishBehavior(ConnectionStatus.idle),
      refCount()
    )

    this.connectionStream.subscribe(connectionEvent => {
      if (connectionEvent.type === ConnectionEventType.CONNECTED) {
        this.connectionUrl = this.autobahn.getConnection().transport.info.url
        this.connectionType = this.autobahn.getConnection().transport.info.type
      } else {
        this.connectionUrl = ''
        this.connectionType = ConnectionType.Unknown
      }
    })
  }

  static DISCONNECT_SESSION_AFTER = 1000 * 60 * 15

  get connectionStatusStream(): Observable<ConnectionStatus> {
    return this.connectionStatusSubject.pipe(distinctUntilChanged())
  }

  get url(): string {
    return this.connectionUrl
  }

  get connected(): boolean {
    return this.connectionType !== ConnectionType.Unknown
  }

  get type() {
    return this.connectionType
  }

  disconnect() {
    log.info('Disconnecting connection')
    this.autobahn.close()
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
      mergeMap(
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
              if (!subscription) {
                return
              }
              try {
                if (session) {
                  session
                    .unsubscribe(subscription)
                    .then(
                      gone =>
                        log.info(
                          `Successfully unsubscribing from topic ${topic}`
                        ),
                      err =>
                        log.error(
                          `Error unsubscribing from topic ${topic}`,
                          err
                        )
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
          })
      )
    )
  }

  startAutoDisconnectTimer() {
    return timer(Connection.DISCONNECT_SESSION_AFTER).subscribe(() => {
      log.debug('Auto disconnect timeout elapsed')
      this.disconnect()
    })
  }
}
