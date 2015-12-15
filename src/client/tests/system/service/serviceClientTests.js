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
        assertExpectedStatusUpdateCount(0);
    });

    it('yields a connection status when matching service heartbeat is received', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        assertExpectedStatusUpdateCount(1);
    });

    it('ignores heartbeats for unrelated services', () => {
        connect();
        pushServiceHeartbeat('booking', 'booking.1', 0);
        assertExpectedStatusUpdateCount(0);
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        assertExpectedStatusUpdateCount(1);
        pushServiceHeartbeat('execution', 'booking.1', 0);
        assertExpectedStatusUpdateCount(1);
    });

    it('groups heartbeats for service instances by service type', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdateCount(2);
        assertServiceInstanceStatus(1, 'pricing.1', true);
        assertServiceInstanceStatus(1, 'pricing.2', true);
    });

    it('marks service instances as connected on heartbeat', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        assertExpectedStatusUpdateCount(1);
        assertServiceInstanceStatus(0, 'pricing.1', true);
    });

    it('marks service instances as disconnected on heartbeat timeout', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
        assertExpectedStatusUpdateCount(2);
        assertServiceInstanceStatus(0, 'pricing.1', true);
        assertServiceInstanceStatus(1, 'pricing.1', false);
    });

    it('manages and disconnects heartbeats for each service instances separately', () => {
        connect();
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);

        // keep pricing.2 alive
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdateCount(3);

        // disconnect pricing.1 by moving the schedule past the time out interval
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
        assertExpectedStatusUpdateCount(4);
        assertServiceInstanceStatus(3, 'pricing.1', false);
        assertServiceInstanceStatus(3, 'pricing.2', true);

        // again move the schedule forward, since now heartbeat from pricing.2 has been missed that'll disconnect
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
        assertExpectedStatusUpdateCount(5);
        assertServiceInstanceStatus(4, 'pricing.1', false);
        assertServiceInstanceStatus(4, 'pricing.2', false);

        // reconnect pricing 2
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdateCount(6);
        assertServiceInstanceStatus(5, 'pricing.1', false);
        assertServiceInstanceStatus(5, 'pricing.2', true);

        // reconnect pricing 1
        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        assertExpectedStatusUpdateCount(7);
        assertServiceInstanceStatus(6, 'pricing.1', true);
        assertServiceInstanceStatus(6, 'pricing.2', true);

        // disconnect both, each will cause a separate yield as each service instance get processed independently (thus the count of 9)
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
        assertExpectedStatusUpdateCount(9);
        assertServiceInstanceStatus(8, 'pricing.1', false);
        assertServiceInstanceStatus(8, 'pricing.2', false);
    });

    fit('disconnects service instance when underlying connection goes down', () => {
        connect();

        //pushServiceHeartbeat('pricing', 'pricing.1', 0);
        //_stubAutobahnProxy.setIsConnected(false);

        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        pushServiceHeartbeat('pricing', 'pricing.2', 0);
        assertExpectedStatusUpdateCount(2);
        _stubAutobahnProxy.setIsConnected(false);
        assertExpectedStatusUpdateCount(4);

    });

    it('handles underlying connection bouncing before any heartbeats are received', () => {
        connect();

        pushServiceHeartbeat('pricing', 'pricing.1', 0);
        _stubAutobahnProxy.setIsConnected(false);

        //pushServiceHeartbeat('pricing', 'pricing.1', 0);
        //pushServiceHeartbeat('pricing', 'pricing.2', 0);
        //assertExpectedStatusUpdateCount(2);
        //_stubAutobahnProxy.setIsConnected(false);
        //assertExpectedStatusUpdateCount(4);

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

    function assertExpectedStatusUpdateCount(expectedCount : Number) {
        expect(_receivedServiceStatusSummaryStream.length).toEqual(expectedCount);
    }
    function assertServiceInstanceStatus(statusUpdateIndex : Number, serviceId : String, expectedIsConnectedStatus : Boolean) {
        var serviceStatusSummary = _receivedServiceStatusSummaryStream[statusUpdateIndex];
        expect(serviceStatusSummary).toBeDefined('Can\'t find service status summary at index ' + statusUpdateIndex);
        var instanceStatusSummary = serviceStatusSummary.getInstanceSummary(serviceId);
        expect(instanceStatusSummary).toBeDefined();
        expect(instanceStatusSummary.isConnected).toEqual(expectedIsConnectedStatus);
    }
});
