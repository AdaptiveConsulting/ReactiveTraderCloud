import system from 'system';
import StubAutobahnProxy from './stubAutobahnProxy';

describe('Connection', () => {
    let _stubAutobahnProxy, _connection, _receivedStatusUpdates;

    beforeEach(() => {
        _stubAutobahnProxy = new StubAutobahnProxy();
        _connection = new system.service.Connection(_stubAutobahnProxy);
        _receivedStatusUpdates = [];
        _connection.connectionStatusStream.subscribe(isConnected => {
            _receivedStatusUpdates.push(isConnected);
        });
    });

    it('subscribes to autobahn open on open()', () => {
        _connection.open();
        expect(_stubAutobahnProxy.onOpenCallbacks.length).toEqual(1);
    });

    it('subscribes to autobahn close on open()', () => {
        _connection.open();
        expect(_stubAutobahnProxy.onCloseCallbacks.length).toEqual(1);
    });

    it('only opens underlying once when you call .open()', () => {
        _connection.open();
        _connection.open();
        _connection.open();
        expect(_stubAutobahnProxy.onOpenCallbacks.length).toEqual(1);
    });

    it('pumps connection status of false on initial connect before open', () => {
        expect(_receivedStatusUpdates.length).toEqual(1);
        expect(_receivedStatusUpdates).toEqual([false]);
    });

    it('pumps connection status of true when connection comes up', () => {
        _connection.open();
        _stubAutobahnProxy.setIsConnected(true);
        expect(_receivedStatusUpdates.length).toEqual(2);
        expect(_receivedStatusUpdates).toEqual([false, true]);
    });

    it('pumps connection status of false when connection goes down', () => {
        _connection.open();
        _stubAutobahnProxy.setIsConnected(true);
        _stubAutobahnProxy.setIsConnected(false);
        expect(_receivedStatusUpdates.length).toEqual(3);
        expect(_receivedStatusUpdates).toEqual([false, true, false]);
    });

    describe('getWellKnownStream', () => {
        it('errors if called before session is set', () => {
            var streamYieldCount = 0, receivedError;
            _connection.getWellKnownStream('status').subscribe(_ =>{
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
