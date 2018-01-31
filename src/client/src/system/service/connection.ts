import Guard from '../guard'
import { Observable, BehaviorSubject, Subscription, Scheduler } from 'rxjs/Rx'
import { ConnectionType, ConnectionStatus } from '../../types'
import { ConnectionTypeMapper } from '../../services/mappers'
import logger from '../logger'
import AutobahnConnectionProxy from './autobahnConnectionProxy'
import { Error } from 'autobahn'
import { SerialSubscription } from '../../serialSubscription'

const log = logger.create('Connection')

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
  autobahn: any
  disposables: Subscription
  connectionStatusSubject: BehaviorSubject<any>
  connectCalled: boolean
  autoDisconnectDisposable: SerialSubscription
  connectionType: any
  connectionUrl: string
  connectionTypeMapper: ConnectionTypeMapper
  session: any

  constructor(userName: string, autobahn: AutobahnConnectionProxy) {
    this.disposables = new Subscription()
    Guard.isDefined(autobahn, 'autobahn required')
    Guard.isString(userName, 'userName required')
    this.userName = userName
    this.autobahn = autobahn
    this.connectionStatusSubject = new BehaviorSubject(ConnectionStatus.idle)
    this.connectionTypeMapper = new ConnectionTypeMapper()
    this.connectCalled = false
    this.isConnected = false
    this.autoDisconnectDisposable = new SerialSubscription()
    this.connectionUrl = ''
    this.connectionType = ConnectionType.Unknown
    this.disposables.add(this.autoDisconnectDisposable)
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
  get connectionStatusStream(): Observable<string> {
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
      this.autobahn.onopen(session => {
        log.info('Connected')
        this.isConnected = true
        this.session = session
        this.connectionUrl = this.autobahn.connection.transport.info.url
        this.connectionType = this.connectionTypeMapper.map(
          this.autobahn.connection.transport.info.type
        )
        this.startAutoDisconnectTimer()
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

  logResponse(topic: string, response: Array<any>): void {
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
  subscribeToTopic(topic: string): Observable<any> {
    return Observable.create(o => {
      const disposables = new Subscription()
      log.debug(
        `Subscribing to topic [${topic}]. Is connected [${this.isConnected}]`
      )

      if (!this.isConnected) {
        o.error(
          new Error(
            `Session not connected, can\'t subscribe to topic [${topic}]`
          )
        )
        return disposables
      }

      let subscription
      this.autobahn.session
        .subscribe(topic, (response: Array<any>) => {
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

      disposables.add(
        new Subscription(() => {
          if (!subscription) {
            return
          }
          try {
            this.autobahn.session
              .unsubscribe(subscription)
              .then(
                gone =>
                  log.verbose(`Successfully unsubscribing from topic ${topic}`),
                err => log.error(`Error unsubscribing from topic ${topic}`, err)
              )
          } catch (err) {
            log.error(`Error thrown unsubscribing from topic ${topic}`, err)
          }
        })
      )
      return disposables
    })
  }

  /**
   * wraps a RPC up as an observable stream
   * @param remoteProcedure
   * @param payload
   * @param responseTopic
   * @returns {Observable}
   */
  requestResponse(
    remoteProcedure: string,
    payload,
    responseTopic: string = ''
  ): Observable<any> {
    return Observable.create(o => {
      log.debug(
        `Doing a RPC to [${remoteProcedure}]. Is connected [${this
          .isConnected}]`
      )

      const disposables = new Subscription()
      if (!this.isConnected) {
        o.error(
          new Error(
            `Session not connected, can\'t perform remoteProcedure ${remoteProcedure}`
          )
        )
        return disposables
      }
      let isDisposed
      const dto = [
        {
          payload,
          replyTo: responseTopic,
          Username: this.userName
        }
      ]

      this.autobahn.session.call(remoteProcedure, dto).then(
        result => {
          if (!isDisposed) {
            o.next(result)
            o.complete()
          } else {
            log.verbose(
              `Ignoring response for remoteProcedure [${remoteProcedure}] as stream disposed`
            )
          }
        },
        error => {
          if (!isDisposed) {
            o.error(error)
          } else {
            log.error(
              `Ignoring error for remoteProcedure [${remoteProcedure}] as stream disposed.`,
              error
            )
          }
        }
      )

      const sub = new Subscription()
      sub.unsubscribe()
      disposables.add(sub)

      return disposables
    })
  }

  startAutoDisconnectTimer() {
    this.autoDisconnectDisposable.add(
      Scheduler.async.schedule(
        () => {
          log.debug('Auto disconnect timeout elapsed')
          this.disconnect()
        },
        Connection.DISCONNECT_SESSION_AFTER,
        ''
      )
    )
  }
}
