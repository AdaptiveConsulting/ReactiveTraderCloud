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
        assertExpectedStatusUpdate(0);
    });

    it('yields a connection status when matching service heartbeat is received', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        assertExpectedStatusUpdate(1, true);
    });

    it('ignores heartbeats for unrelated services', () => {
        connect();
        pushServiceHeartbeat('booking', 'booking.1', 0);
        assertExpectedStatusUpdate(0);
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        assertExpectedStatusUpdate(1, true);
        pushServiceHeartbeat('execution', 'booking.1', 0);
        assertExpectedStatusUpdate(1, true);
    });

    it('groups heartbeats for service instances by service type', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdate(2, true);
        assertServiceInstanceStatus(1, 'pricing.1', true);
        assertServiceInstanceStatus(1, 'pricing.2', true);
    });

    it('marks service instances as connected on heartbeat', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        assertExpectedStatusUpdate(1, true);
        assertServiceInstanceStatus(0, 'pricing.1', true);
    });

    it('marks service instances as disconnected on heartbeat timeout', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
        assertServiceInstanceStatus(0, 'pricing.1', true);
        assertExpectedStatusUpdate(2, false);
        assertServiceInstanceStatus(1, 'pricing.1', false);
    });

    it('manages and disconnects heartbeats for each service instances separately', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);

        // keep pricing.2 alive
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdate(3, true);

        // disconnect pricing.1 by moving the schedule past the time out interval
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
        assertExpectedStatusUpdate(4, true);
        assertServiceInstanceStatus(3, 'pricing.1', false);
        assertServiceInstanceStatus(3, 'pricing.2', true);

        // again move the schedule forward, since now heartbeat from pricing.2 has been missed that'll disconnect
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
        assertExpectedStatusUpdate(5, false);
        assertServiceInstanceStatus(4, 'pricing.1', false);
        assertServiceInstanceStatus(4, 'pricing.2', false);

        // reconnect pricing 2
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdate(6, true);
        assertServiceInstanceStatus(5, 'pricing.1', false);
        assertServiceInstanceStatus(5, 'pricing.2', true);

        // reconnect pricing 1
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        assertExpectedStatusUpdate(7, true);
        assertServiceInstanceStatus(6, 'pricing.1', true);
        assertServiceInstanceStatus(6, 'pricing.2', true);

        // disconnect both, each will cause a separate yield as each service instance get processed independently (thus the count of 9)
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
        assertExpectedStatusUpdate(9, false);
        assertServiceInstanceStatus(8, 'pricing.1', false);
        assertServiceInstanceStatus(8, 'pricing.2', false);
    });

    it('disconnects service instance when underlying connection goes down', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdate(2, true);
        _stubAutobahnProxy.setIsConnected(false);
        assertExpectedStatusUpdate(3, false);
    });

    it('handles underlying connection bouncing before any heartbeats are received', () => {
        connect();
        _stubAutobahnProxy.setIsConnected(false);
        _stubAutobahnProxy.setIsConnected(true);
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        assertExpectedStatusUpdate(2, true);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdate(3, true);
    });

    it('disconnects then reconnect new service instance after underlying connection is bounced', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdate(2, true);
        assertServiceInstanceStatus(0, 'pricing.1', true);
        assertServiceInstanceStatus(1, 'pricing.1', true);
        _stubAutobahnProxy.setIsConnected(false);
        assertExpectedStatusUpdate(3, false);
        _stubAutobahnProxy.setIsConnected(true);
        pushServiceHeartbeat('pricing', 'pricing.4', 0);
        assertExpectedStatusUpdate(4, true);
        assertServiceInstanceStatus(3, 'pricing.4', true);
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

    function assertExpectedStatusUpdate(expectedCount : Number, lastStatusExpectedIsConnectedStatus : Boolean) {
        expect(_receivedServiceStatusSummaryStream.length).toEqual(expectedCount);
        if(expectedCount > 0) {
            expect(_receivedServiceStatusSummaryStream[expectedCount - 1].isConnected).toEqual(lastStatusExpectedIsConnectedStatus);
        }
    }
    
    function assertServiceInstanceStatus(statusUpdateIndex : Number, serviceId : String, expectedIsConnectedStatus : Boolean) {
        var serviceStatusSummary = _receivedServiceStatusSummaryStream[statusUpdateIndex];
        expect(serviceStatusSummary).toBeDefined('Can\'t find service status summary at index ' + statusUpdateIndex);
        var instanceStatusSummary = serviceStatusSummary.getInstanceSummary(serviceId);
        expect(instanceStatusSummary).toBeDefined();
        expect(instanceStatusSummary.isConnected).toEqual(expectedIsConnectedStatus);
    }
});
