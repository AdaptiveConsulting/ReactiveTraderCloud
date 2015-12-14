import Rx from 'rx';
import system from 'system';
import StubAutobahnProxy from './stubAutobahnProxy';

describe('ServiceClient', () => {
    let _stubAutobahnProxy : StubAutobahnProxy,
        _connection : system.service.Connection,
        _receivedServiceStatusSummaryStream : Array<system.service.ServiceStatusSummary>,
        _serviceClient : system.service.ServiceClient,
        _scheduler : system.SchedulerService;

    beforeEach(() => {
        _scheduler = new Rx.HistoricalScheduler();
        _stubAutobahnProxy = new StubAutobahnProxy();
        var stubSchedulerService = {
            timeout: _scheduler
        }
        _connection = new system.service.Connection(_stubAutobahnProxy);
        _serviceClient = new system.service.ServiceClient('pricing', _connection, stubSchedulerService);
        _receivedServiceStatusSummaryStream = [];
        _serviceClient.serviceStatusSummaryStream.subscribe(statusSummary => {
            _receivedServiceStatusSummaryStream.push(statusSummary);
        });
    });

    it('doesn\'t yield a status before being opened', () => {
        expect(_receivedServiceStatusSummaryStream.length).toEqual(0);
    });

    it('yields a connection status when matching service heartbeat is received', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(1);
    });

    it('ignores heartbeats for unrelated services', () => {
        connect();
        pushServiceHeartbeat('booking', 'booking.1', 0);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(0);
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(1);
        pushServiceHeartbeat('execution', 'booking.1', 0);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(1);
    });

    it('groups heartbeats for service instances by service type', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(2);
        var serviceInstances : Array<system.service.ServiceInstanceSummary> = _receivedServiceStatusSummaryStream[1].instances;
        expect(serviceInstances.length).toEqual(2);
        expect(serviceInstances[0].instanceId).toEqual('pricing.1');
        expect(serviceInstances[1].instanceId).toEqual('pricing.2');
    });

    it('marks service instances as connected on heartbeat', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(1);
        var serviceInstance : system.service.ServiceInstanceSummary = _receivedServiceStatusSummaryStream[0].instances[0];
        expect(serviceInstance.instanceId).toEqual('pricing.1');
        expect(serviceInstance.isConnected).toEqual(true);
    });

    it('marks service instances as disconnected on heartbeat timeout', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(2);
        var serviceInstance : system.service.ServiceInstanceSummary = _receivedServiceStatusSummaryStream[1].instances[0];
        expect(serviceInstance.instanceId).toEqual('pricing.1');
        expect(serviceInstance.isConnected).toEqual(false);
    });

    fit('manages and disconnects heartbeats for each service instances separately', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);

        // keep pricing.2 alive
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(3);

        // timeout pricing.1 by moving the schedule past the time out interval
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(4);

        // again move the schedule forward, since now heartbeat from pricing.2 that'll now timeout
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(5);

        // reconnect pricing 2
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(6);

        // reconnect pricing 1
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(7);

        // disconnect both, each will cause a seperate yield
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
        expect(_receivedServiceStatusSummaryStream.length).toEqual(10);
    });

    function connect() {
        _connection.connect();
        _serviceClient.connect();
        _stubAutobahnProxy.setIsConnected(true);
    }

    function pushServiceHeartbeat(serviceType : String, instanceId : String, instanceLoad : Number) {
        _stubAutobahnProxy.session.getTopic('status').onResults({
            Type : serviceType,
            Instance: instanceId,
            TimeStamp: '',
            Load : instanceLoad
        });
    }
});
