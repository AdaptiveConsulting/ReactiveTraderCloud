import { Error, ISubscription } from 'autobahn'
import { BehaviorSubject, Observable, Scheduler, Subscription } from 'rxjs'
import { connectionTypeMapper } from '../../services/mappers'
import { ConnectionStatus, ConnectionType } from '../../types'
import logger from '../logger'
import { AutobahnConnection } from './AutoBahnConnection'
import AutobahnConnectionProxy from './autobahnConnectionProxy'
import './AutoBahnTypeExtensions'

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
  connectionStatusSubject: BehaviorSubject<ConnectionStatus>
  connectCalled: boolean
  autoDisconnectDisposable?: Subscription
  connectionType: ConnectionType
  connectionUrl: string

  constructor(userName: string, autobahn: AutobahnConnection) {
    this.userName = userName
    this.autobahn = autobahn
    this.connectionStatusSubject = new BehaviorSubject(ConnectionStatus.idle)
    this.connectCalled = false
    this.isConnected = false
    this.connectionUrl = ''
    this.connectionType = ConnectionType.Unknown
  }

  static get DISCONNECT_SESSION_AFTER() {
    // hardcode a disconnect so we don't stream needlessly when ppl leave the app open for an extended time (i.e. over weekends, etc)
    return 1000 * 60 * 15 // 15 mins
  }

  isConnected: boolean

  /**
   * A stream of the current connection status (see ConnectionStatus for possible values)
   * @returns {*}
   */
  get connectionStatusStream(): Observable<ConnectionStatus> {
    return this.connectionStatusSubject.distinctUntilChanged()
  }

  /**
   * Connection url
   * @returns {string}
   */
  get url(): string {
    return this.connectionUrl
  }

  /**
   * Connection type
   * @returns {ConnectionType}
   */
  get type() {
    return this.connectionType
  }

  /**
   * Connects the underlying transport
   */
  connect(): void {
    if (!this.connectCalled) {
      this.connectCalled = true
      log.info('Opening connection')
      this.autobahn.onopen(() => {
        log.info('Connected')
        this.isConnected = true
        this.connectionUrl = this.autobahn.getConnection().transport.info.url
        this.connectionType = connectionTypeMapper(
          this.autobahn.getConnection().transport.info.type
        )
        this.autoDisconnectDisposable = this.startAutoDisconnectTimer()
        this.connectionStatusSubject.next(ConnectionStatus.connected)
      })
      this.autobahn.onclose((reason, details) => {
        log.error(`Connection lost, reason: [${reason}]`)
        log.error(`Connection lost, details: [${JSON.stringify(details)}]`)
        this.isConnected = false
        const disconnectTimerDisposable = this.autoDisconnectDisposable
        if (disconnectTimerDisposable) {
          disconnectTimerDisposable.unsubscribe()
        }
        // if we explicitly called close then we move to ConnectionStatus.idle status
        if (reason === 'closed') {
          this.connectionStatusSubject.next(ConnectionStatus.sessionExpired)
        } else {
          this.connectionStatusSubject.next(ConnectionStatus.disconnected)
        }
      })
      this.autobahn.open()
    }
  }

  /**
   * Disconnects the underlying transport
   */
  disconnect() {
    if (this.connectCalled) {
      log.info('Disconnecting connection')
      this.connectCalled = false
      this.autobahn.close()
    }
  }

  logResponse(topic: string, response: any[]): void {
    if (log.isVerboseEnabled) {
      const payloadString = JSON.stringify(response[0])
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
  subscribeToTopic<T>(topic: string): Observable<T> {
    return new Observable<T>(o => {
      log.debug(
        `Subscribing to topic [${topic}]. Is connected [${this.isConnected}]`
      )

      if (!this.isConnected || !this.autobahn.session) {
        o.error(
          new Error(
            `Session not connected, can\'t subscribe to topic [${topic}]`
          )
        )
        return
      }

      let subscription: ISubscription

      this.autobahn.session
        .subscribe<T>(topic, response => {
          this.logResponse(topic, response)
          o.next(response[0])
        })
        .then(
          sub => {
            // subscription succeeded, subscription is an instance of autobahn.Subscription
            log.verbose(`subscription acked on topic [${topic}]`)
            subscription = sub
          },
          (error: Error) => {
            // subscription failed, error is an instance of autobahn.Error
            log.error(`Error on topic ${topic}`, error)
            o.error(error)
          }
        )

      return () => {
        if (!subscription) {
          return
        }
        try {
          if (this.autobahn.session) {
            this.autobahn.session
              .unsubscribe(subscription)
              .then(
                gone =>
                  log.verbose(`Successfully unsubscribing from topic ${topic}`),
                err => log.error(`Error unsubscribing from topic ${topic}`, err)
              )
          }
        } catch (err) {
          log.error(`Error thrown unsubscribing from topic ${topic}`, err)
        }
      }
    })
  }

  /**
   * wraps a RPC up as an observable stream
   */

  requestResponse<TResult, TPayload>(
    remoteProcedure: string,
    payload: TPayload,
    responseTopic: string = ''
  ) {
    return new Observable<TResult>(obs => {
      log.debug(
        `Doing a RPC to [${remoteProcedure}]. Is connected [${
          this.isConnected
        }]`
      )

      if (!this.isConnected || !this.autobahn.session) {
        obs.error(
          new Error(
            `Session not connected, can\'t perform remoteProcedure ${remoteProcedure}`
          )
        )
        return
      }

      const dto: SubscriptionRequest<TPayload> = [
        {
          payload,
          replyTo: responseTopic,
          Username: this.userName
        }
      ]

      this.autobahn.session.call<TResult>(remoteProcedure, dto).then(
        result => {
          obs.next(result)
          obs.complete()
        },
        error => {
          obs.error(error)
        }
      )
    })
  }

  startAutoDisconnectTimer() {
    return Scheduler.async.schedule<void>(() => {
      log.debug('Auto disconnect timeout elapsed')
      this.disconnect()
    }, Connection.DISCONNECT_SESSION_AFTER)
  }
}
