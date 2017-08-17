import Guard from '../guard';
import { Observable, BehaviorSubject, Subscription } from 'rxjs/Rx';
import DisposableBase from '../disposables/disposableBase';
import ConnectionStatus from './connectionStatus';
import { ConnectionTypeMapper } from '../../services/mappers';
import logger from '../logger';
import SchedulerService from '../schedulerService';
import ConnectionType from '../../services/model/connectionType';
import AutobahnConnectionProxy from './autobahnConnectionProxy';
import { Error } from 'autobahn';

const _log = logger.create('Connection');

/**
 * Represents a Connection to autobahn
 */
export default class Connection extends DisposableBase {
  _userName: string;
  _autobahn: any;
  _connectionStatusSubject: BehaviorSubject<any>;
  _serviceStatusSubject: BehaviorSubject<any>;
  _connectCalled: boolean;
  _schedulerService: SchedulerService;
  _autoDisconnectDisposable: Subscription;
  _connectionType: any;
  _connectionUrl: string;
  _connectionTypeMapper: ConnectionTypeMapper;
  _session: any;

  constructor(userName: string, autobahn: AutobahnConnectionProxy, schedulerService: SchedulerService) {
    super();
    Guard.isDefined(autobahn, 'autobahn required');
    Guard.isString(userName, 'userName required');
    Guard.isDefined(schedulerService, 'schedulerService required');
    this._userName = userName;
    this._autobahn = autobahn;
    this._connectionStatusSubject = new BehaviorSubject(ConnectionStatus.idle);
    this._serviceStatusSubject = new BehaviorSubject(false);
    this._connectionTypeMapper = new ConnectionTypeMapper();
    this._connectCalled = false;
    this._isConnected = false;
    this._schedulerService = schedulerService;
    this._autoDisconnectDisposable = new Subscription();
    this._connectionUrl = '';
    this._connectionType = ConnectionType.Unknown;
    this.addDisposable(this._autoDisconnectDisposable);
  }

  static get DISCONNECT_SESSION_AFTER() {
    // hardcode a disconnect so we don't stream needlessly when ppl leave the app open for an extended time (i.e. over weekends, etc)
    return 1000 * 60 * 15; // 15 mins
  }

  _isConnected: boolean;

  /**
   * A boolean indicating if we're currently connected.
   * @returns {Boolean}
   */
  get isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * A stream of the current connection status (see ConnectionStatus for possible values)
   * @returns {*}
   */
  get connectionStatusStream(): Observable<string> {
    return this._connectionStatusSubject.distinctUntilChanged();
  }

  /**
   * Connection url
   * @returns {string}
   */
  get url(): string {
    return this._connectionUrl;
  }

  /**
   * Connection type
   * @returns {ConnectionType}
   */
  get type() {
    return this._connectionType;
  }

  /**
   * Connects the underlying transport
   */
  connect(): void {
    if (!this._connectCalled) {
      this._connectCalled = true;
      _log.info('Opening connection');
      _log.verbose('Autobahn: ' + JSON.stringify(this._autobahn));

      this._autobahn.onopen(session => {
        _log.info('Connected');
        this._isConnected = true;
        this._session = session;
        this._connectionUrl = this._autobahn.connection.transport.info.url;
        this._connectionType = this._connectionTypeMapper.map(this._autobahn.connection.transport.info.type);
        this._startAutoDisconnectTimer();
        this._connectionStatusSubject.next(ConnectionStatus.connected);
        console.log('Connection status subject --->', ConnectionStatus.connected)
      });
      this._autobahn.onclose((reason, details) => {
        _log.error(`Connection lost, reason: [${reason}]`);
        _log.error(`Connection lost, details: [${JSON.stringify(details)}]`);
        this._isConnected = false;
        var disconnectTimerDisposable = this._autoDisconnectDisposable;
        if (disconnectTimerDisposable) {
          disconnectTimerDisposable.unsubscribe();
        }
        // if we explicitly called close then we move to ConnectionStatus.idle status
        if (reason === 'closed') {
          this._connectionStatusSubject.next(ConnectionStatus.sessionExpired);
        } else {
          this._connectionStatusSubject.next(ConnectionStatus.disconnected);
        }
      });
      this._autobahn.open();
    }
  }

  /**
   * Disconnects the underlying transport
   */
  disconnect() {
    if (this._connectCalled) {
      _log.info('Disconnecting connection');
      this._connectCalled = false;
      this._autobahn.close();
    }
  }

  _logResponse(topic: string, response: Array<any>): void {
    if (_log.isVerboseEnabled) {
      var payloadString = JSON.stringify(response[0]);
      _log.verbose(`Received response on topic [${topic}]. Payload[${payloadString}]`);
    }
  }

  /**
   * Get an observable subscription to a well known topic/stream
   * @param topic
   * @returns {Observable}
   */
  subscribeToTopic(topic: string): Observable<any> {
    return Observable.create((o) => {

      let disposables = new Subscription();
      _log.debug(`Subscribing to topic [${topic}]. Is connected [${this._isConnected}]`);

      if (!this.isConnected) {
        o.error(new Error(`Session not connected, can\'t subscribe to topic [${topic}]`));
        return disposables;
      }

      let subscription;
      this._autobahn.session.subscribe(topic, (response: Array<any>) => {
        this._logResponse(topic, response);
        o.next(response[0]);
      }).then((sub) => {
        // subscription succeeded, subscription is an instance of autobahn.Subscription
        _log.verbose(`subscription acked on topic [${topic}]`);
        subscription = sub;
      }, (error: Error) => {
        // subscription failed, error is an instance of autobahn.Error
        _log.error(`Error on topic ${topic}`, error);
        o.error(error);
      });

      disposables.add(new Subscription(() => {
        if (!subscription) {
          return;
        }
        try {
          this._autobahn.session.unsubscribe(subscription).then(
            gone => {
              _log.verbose(`Successfully unsubscribing from topic ${topic}`);
            },
            err => {
              _log.error(`Error unsubscribing from topic ${topic}`, err);
            }
          );
        } catch (err) {
          _log.error(`Error thrown unsubscribing from topic ${topic}`, err);
        }
      }));
      return disposables;
    });
  }

  /**
   * wraps a RPC up as an observable stream
   * @param remoteProcedure
   * @param payload
   * @param responseTopic
   * @returns {Observable}
   */
  requestResponse(remoteProcedure: string, payload, responseTopic: string = ''): Observable<any> {
    return Observable.create((o) => {
      _log.debug(`Doing a RPC to [${remoteProcedure}]. Is connected [${this._isConnected}]`);

      let disposables = new Subscription();
      if (!this.isConnected) {
        o.error(new Error(`Session not connected, can\'t perform remoteProcedure ${remoteProcedure}`));
        return disposables;
      }
      let isDisposed;
      let dto = [{
        replyTo: responseTopic,
        Username: this._userName,
        payload: payload
      }];

      this._autobahn.session.call(remoteProcedure, dto).then(
        result => {
          if (!isDisposed) {
            o.next(result);
            o.complete();
          } else {
            _log.verbose(`Ignoring response for remoteProcedure [${remoteProcedure}] as stream disposed`);
          }
        },
        error => {
          if (!isDisposed) {
            o.error(error);
          } else {
            _log.error(`Ignoring error for remoteProcedure [${remoteProcedure}] as stream disposed.`, error);
          }
        }
      );

      const sub = new Subscription();
      sub.unsubscribe();
      disposables.add(sub);

      return disposables;
    });
  }

  _startAutoDisconnectTimer() {
    this._autoDisconnectDisposable.add(
      this._schedulerService.async.schedule(
        () => {
          _log.debug('Auto disconnect timeout elapsed');
          this.disconnect();
        },
        Connection.DISCONNECT_SESSION_AFTER,
        ''
      )
    );
  }
}
