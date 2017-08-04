import StubAutobahnProxy from './autobahnConnectionProxyStub';
import Connection from '../../../src/system/service/connection';
import SchedulerService from '../../../src/system/schedulerService';
import ConnectionStatus from '../../../src/system/service/connectionStatus';

describe('Connection', () => {
  
  let _stubAutobahnProxy,
  _connection,
  _receivedStatusUpdates;

  beforeEach(() => {
    _stubAutobahnProxy = new StubAutobahnProxy();
    _connection = new Connection('user', _stubAutobahnProxy, new SchedulerService());
    _receivedStatusUpdates = [];
    _connection.connectionStatusStream.subscribe(isConnected => {
      _receivedStatusUpdates.push(isConnected);
    });
  });

  test('subscribes to autobahn open on connect()', () => {
    _connection.connect();
    expect(_stubAutobahnProxy.onOpenCallbacks.length).toEqual(1);
  });

  test('subscribes to autobahn close on connect()', () => {
    _connection.connect();
    expect(_stubAutobahnProxy.onCloseCallbacks.length).toEqual(1);
  });

  test('only opens underlying once when you call .connect()', () => {
    _connection.connect();
    _connection.connect();
    _connection.connect();
    expect(_stubAutobahnProxy.onOpenCallbacks.length).toEqual(1);
  });

  test('pumps connection status of idle on initial connect before open', () => {
    expect(_receivedStatusUpdates.length).toEqual(1);
    expect(_receivedStatusUpdates).toEqual([ConnectionStatus.idle]);
  });

  test('pumps connection status of connected when connection comes up', () => {
    _connection.connect();

    _stubAutobahnProxy.setIsConnected(true);
    expect(_receivedStatusUpdates.length).toEqual(2);
    expect(_receivedStatusUpdates).toEqual([
      ConnectionStatus.idle,
      ConnectionStatus.connected
    ]);
  });

  test('pumps connection status of disconnected when connection goes down', () => {
    _connection.connect();
    _stubAutobahnProxy.setIsConnected(true);
    _stubAutobahnProxy.setIsConnected(false);
    expect(_receivedStatusUpdates.length).toEqual(3);
    expect(_receivedStatusUpdates).toEqual([
      ConnectionStatus.idle,
      ConnectionStatus.connected,
      ConnectionStatus.disconnected
    ]);
  });

  test('errors if called before session is set', () => {
    var streamYieldCount = 0, receivedError;
    _connection.subscribeToTopic('status').subscribe(_ => {
      streamYieldCount++;
    }, ex => {
      receivedError = ex;
    });
    expect(streamYieldCount).toEqual(0);
    expect(receivedError).toBeDefined();
    expect(receivedError.error).toEqual('Session not connected, can\'t subscribe to topic [status]');
  });
});
