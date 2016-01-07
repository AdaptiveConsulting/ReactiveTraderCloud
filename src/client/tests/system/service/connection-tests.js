import system from 'system';
import StubAutobahnProxy from './stub-autobahn-proxy';

describe('Connection', () => {
  let _stubAutobahnProxy:StubAutobahnProxy,
    _connection:system.service.Connection,
    _receivedStatusUpdates:Array<Boolean>,
    _scheduler:system.SchedulerService;

  beforeEach(() => {
    _scheduler = new Rx.HistoricalScheduler();
    var stubSchedulerService = {
      async: _scheduler
    }
    _stubAutobahnProxy = new StubAutobahnProxy();
    _connection = new system.service.Connection('user', _stubAutobahnProxy, stubSchedulerService);
    _receivedStatusUpdates = [];
    _connection.connectionStatusStream.subscribe(isConnected => {
      _receivedStatusUpdates.push(isConnected);
    });
  });

  it('subscribes to autobahn open on connect()', () => {
    _connection.connect();
    expect(_stubAutobahnProxy.onOpenCallbacks.length).toEqual(1);
  });

  it('subscribes to autobahn close on connect()', () => {
    _connection.connect();
    expect(_stubAutobahnProxy.onCloseCallbacks.length).toEqual(1);
  });

  it('only opens underlying once when you call .connect()', () => {
    _connection.connect();
    _connection.connect();
    _connection.connect();
    expect(_stubAutobahnProxy.onOpenCallbacks.length).toEqual(1);
  });

  it('pumps connection status of idle on initial connect before open', () => {
    expect(_receivedStatusUpdates.length).toEqual(1);
    expect(_receivedStatusUpdates).toEqual([system.service.ConnectionStatus.idle]);
  });

  it('pumps connection status of connected when connection comes up', () => {
    _connection.connect();
    _stubAutobahnProxy.setIsConnected(true);
    expect(_receivedStatusUpdates.length).toEqual(2);
    expect(_receivedStatusUpdates).toEqual([
      system.service.ConnectionStatus.idle,
      system.service.ConnectionStatus.connected
    ]);
  });

  it('pumps connection status of disconnected when connection goes down', () => {
    _connection.connect();
    _stubAutobahnProxy.setIsConnected(true);
    _stubAutobahnProxy.setIsConnected(false);
    expect(_receivedStatusUpdates.length).toEqual(3);
    expect(_receivedStatusUpdates).toEqual([
      system.service.ConnectionStatus.idle,
      system.service.ConnectionStatus.connected,
      system.service.ConnectionStatus.disconnected
    ]);
  });

  it('auto disconnects session after hardcoded elapsed time', () => {
    _connection.connect();
    _stubAutobahnProxy.setIsConnected(true);
    expect(_receivedStatusUpdates.length).toEqual(2);
    _scheduler.advanceBy(system.service.Connection.DISCONNECT_SESSION_AFTER);
    expect(_receivedStatusUpdates).toEqual([
      system.service.ConnectionStatus.idle,
      system.service.ConnectionStatus.connected,
      system.service.ConnectionStatus.sessionExpired
    ]);
  });

  it('re-opens connection after hardcoded session timeout elapse then explicit connect call', () => {
    _connection.connect();
    _stubAutobahnProxy.setIsConnected(true);
    expect(_connection.isConnected).toEqual(true);
    _scheduler.advanceBy(system.service.Connection.DISCONNECT_SESSION_AFTER);
    expect(_connection.isConnected).toEqual(false);
    _connection.connect();
    _stubAutobahnProxy.setIsConnected(true);
    expect(_connection.isConnected).toEqual(true);
    expect(_receivedStatusUpdates).toEqual([
      system.service.ConnectionStatus.idle,
      system.service.ConnectionStatus.connected,
      system.service.ConnectionStatus.sessionExpired,
      system.service.ConnectionStatus.connected
    ]);
  });

  describe('subscribeToTopic', () => {
    it('errors if called before session is set', () => {
      var streamYieldCount = 0, receivedError;
      _connection.subscribeToTopic('status').subscribe(_ => {
        streamYieldCount++;
      }, ex => {
        receivedError = ex;
      });
      expect(streamYieldCount).toEqual(0);
      expect(receivedError).toBeDefined();
      expect(receivedError).toEqual(new Error('Session not connected, can\'t subscribe to topic [status]'));
    });
  });
});
