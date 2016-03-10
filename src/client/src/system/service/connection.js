import Guard from '../guard';
import Rx from 'rx';
import logger from '../logger';
import { DisposableBase } from '../disposables';
import AutobahnConnectionProxy from './autobahnConnectionProxy';
import ServiceInstanceStatus from './serviceInstanceStatus';
import SchedulerService from '../schedulerService';
import ConnectionStatus from './connectionStatus';

const _log:logger.Logger = logger.create('Connection');

/**
 * Represents a Connection to autobahn
 */
export default class Connection extends DisposableBase {
  _userName:string;
  _autobahn:AutobahnConnectionProxy;
  _connectionStatusSubject:Rx.BehaviorSubject<boolean>;
  _serviceStatusSubject:Rx.BehaviorSubject<ServiceInstanceStatus>;
  _connectCalled:boolean;
  _isConnected:boolean;
  _schedulerService:SchedulerService;
  _autoDisconnectDisposable:Rx.SerialDisposable;

  constructor(userName:string, autobahn:AutobahnConnectionProxy, schedulerService:SchedulerService) {
    super();
    Guard.isDefined(autobahn, 'autobahn required');
    Guard.isString(userName, 'userName required');
    Guard.isDefined(schedulerService, 'schedulerService required');
    this._userName = userName;
    this._autobahn = autobahn;
    this._connectionStatusSubject = new Rx.BehaviorSubject(ConnectionStatus.idle);
    this._serviceStatusSubject = new Rx.BehaviorSubject(false);
    this._connectCalled = false;
    this._isConnected = false;
    this._schedulerService = schedulerService;
    this._autoDisconnectDisposable = new Rx.SerialDisposable();
    this.addDisposable(this._autoDisconnectDisposable);
  }

  static get DISCONNECT_SESSION_AFTER() {
    // hardcode a disconnect so we don't stream needlessly when ppl leave the app open for an extended time (i.e. over weekends, etc)
    return 1000 * 60 * 15; // 15 mins
  }

  /**
   * A stream of the current connection status (see ConnectionStatus for possible values)
   * @returns {*}
   */
  get connectionStatusStream():Rx.Observable<string> {
    return this._connectionStatusSubject.distinctUntilChanged();
  }

  /**
   * A boolean indicating if we're currently connected.
   * @returns {Boolean}
   */
  get isConnected():boolean {
    return this._isConnected;
  }

  /**
   * Connects the underlying transport
   */
  connect():void {
    if (!this._connectCalled) {
      this._connectCalled = true;
      _log.info('Opening connection');
      this._autobahn.onopen(session => {
        _log.info('Connected');
        this._isConnected = true;
        this.session = session;
        this._startAutoDisconnectTimer();
        this._connectionStatusSubject.onNext(ConnectionStatus.connected);
      });
      this._autobahn.onclose((reason, details) => {
        _log.error(`connection lost, reason [${reason}]`);
        this._isConnected = false;
        var disconnectTimerDisposable = this._autoDisconnectDisposable.getDisposable();
        if (disconnectTimerDisposable) {
          disconnectTimerDisposable.dispose();
        }
        // if we explicitly called close then we move to ConnectionStatus.idle status
        if(reason === 'closed') {
          this._connectionStatusSubject.onNext(ConnectionStatus.sessionExpired);
        } else {
          this._connectionStatusSubject.onNext(ConnectionStatus.disconnected);
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

  _logResponse<T>(topic : string, response : Array<TResponse>) : void {
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
  subscribeToTopic<TResponse>(topic:string):Rx.Observable<TResponse> {
    let _this : Connection = this;
    return Rx.Observable.create((o: Rx.Observer<TResponse>) => {
      let disposables = new Rx.CompositeDisposable();
      _log.debug(`Subscribing to topic [${topic}]. Is connected [${_this._isConnected}]`);

      if (!_this.isConnected) {
        o.onError(new Error(`Session not connected, can\'t subscribe to topic [${topic}]`));
        return disposables;
      }

      let subscription;
      _this._autobahn.session.subscribe(topic, (response:Array<TResponse>) => {
        this._logResponse(topic, response);
        o.onNext(response[0]);
      }).then((sub:autobahn.Subscription) => {
        // subscription succeeded, subscription is an instance of autobahn.Subscription
        _log.verbose(`subscription acked on topic [${topic}]`);
        subscription = sub;
      }, (error: autobahn.Error) => {
        // subscription failed, error is an instance of autobahn.Error
        _log.error(`Error on topic ${topic}`, error);
        o.onError(error);
      });

      disposables.add(Rx.Disposable.create(() => {
        if (!subscription) {
          return;
        }
        try {
          _this._autobahn.session.unsubscribe(subscription).then(
            gone => { _log.verbose(`Successfully unsubscribing from topic ${topic}`); },
            err => { _log.error(`Error unsubscribing from topic ${topic}`, err); }
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
  requestResponse<TRequest, TResponse>(remoteProcedure:string, payload:TRequest, responseTopic:string = ''):Rx.Observable<TResponse> {
    let _this : Connection = this;
    return Rx.Observable.create((o:Rx.Observer<TResponse>) => {
      _log.debug(`Doing a RPC to [${remoteProcedure}]. Is connected [${_this._isConnected}]`);

      let disposables = new Rx.CompositeDisposable();
      if (!_this.isConnected) {
        o.onError(new Error(`Session not connected, can\'t perform remoteProcedure ${remoteProcedure}`));
        return disposables;
      }
      let isDisposed:boolean;
      let dto = [{
        replyTo: responseTopic,
        Username: _this._userName,
        payload: payload
      }];

      _this._autobahn.session.call(remoteProcedure, dto).then(
        result => {
          if (!isDisposed) {
            o.onNext(result);
            o.onCompleted();
          } else {
            _log.verbose(`Ignoring response for remoteProcedure [${remoteProcedure}] as stream disposed`);
          }
        },
        error => {
          if (!isDisposed) {
            o.onError(error);
          } else {
            _log.error(`Ignoring error for remoteProcedure [${remoteProcedure}] as stream disposed.`, error);
          }
        }
      );

      disposables.add(Rx.Disposable.create(() => {
        isDisposed = true;
      }));

      return disposables;
    });
  }

  _startAutoDisconnectTimer() {
    this._autoDisconnectDisposable.setDisposable(
      this._schedulerService.async.scheduleFuture(
        '',
        Connection.DISCONNECT_SESSION_AFTER,
        () => {
          _log.debug('Auto disconnect timeout elapsed');
          this.disconnect();
        }
      )
    );
  }
}
