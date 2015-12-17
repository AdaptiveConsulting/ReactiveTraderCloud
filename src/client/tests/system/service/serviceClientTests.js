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
            async: _scheduler
        }
        _connection = new system.service.Connection('user', _stubAutobahnProxy);
        _serviceClient = new system.service.ServiceClient('myServiceType', _connection, stubSchedulerService);
        _receivedServiceStatusSummaryStream = [];
        _serviceClient.serviceStatusSummaryStream.subscribe(statusSummary => {
            _receivedServiceStatusSummaryStream.push(statusSummary);
        });
    });

    it('yield a disconnect status before being opened', () => {
        assertExpectedStatusUpdate(1, false);
    });

    it('yields a connection status when matching service heartbeat is received', () => {
        connect();
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        assertExpectedStatusUpdate(2, true);
    });

    it('ignores heartbeats for unrelated services', () => {
        connect();
        pushServiceHeartbeat('booking', 'booking.1', 0);
        assertExpectedStatusUpdate(1, false);
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        assertExpectedStatusUpdate(2, true);
        pushServiceHeartbeat('execution', 'booking.1', 0);
        assertExpectedStatusUpdate(2, true);
    });

    it('groups heartbeats for service instances by service type', () => {
        connect();
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
        assertExpectedStatusUpdate(3, true);
        assertServiceInstanceStatus(2, 'myServiceType.1', true);
        assertServiceInstanceStatus(2, 'myServiceType.2', true);
    });

    it('marks service instances as connected on heartbeat', () => {
        connect();
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        assertExpectedStatusUpdate(2, true);
        assertServiceInstanceStatus(1, 'myServiceType.1', true);
    });

    it('marks service instances as disconnected on heartbeat timeout', () => {
        connect();
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        assertServiceInstanceStatus(1, 'myServiceType.1', true);
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
        assertExpectedStatusUpdate(3, false);
        assertServiceInstanceStatus(2, 'myServiceType.1', false);
    });

    it('manages and disconnects heartbeats for each service instances separately', () => {
        connect();
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);

        // keep myServiceType.2 alive
        pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
        assertExpectedStatusUpdate(4, true);

        // disconnect myServiceType.1 by moving the schedule past the time out interval
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
        assertExpectedStatusUpdate(5, true);
        assertServiceInstanceStatus(4, 'myServiceType.1', false);
        assertServiceInstanceStatus(4, 'myServiceType.2', true);

        // again move the schedule forward, since now heartbeat from myServiceType.2 has been missed that'll disconnect
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
        assertExpectedStatusUpdate(6, false);
        assertServiceInstanceStatus(5, 'myServiceType.1', false);
        assertServiceInstanceStatus(5, 'myServiceType.2', false);

        // reconnect myServiceType 2
        pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
        assertExpectedStatusUpdate(7, true);
        assertServiceInstanceStatus(6, 'myServiceType.1', false);
        assertServiceInstanceStatus(6, 'myServiceType.2', true);

        // reconnect myServiceType 1
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        assertExpectedStatusUpdate(8, true);
        assertServiceInstanceStatus(7, 'myServiceType.1', true);
        assertServiceInstanceStatus(7, 'myServiceType.2', true);

        // disconnect both, each will cause a separate yield as each service instance get processed independently (thus the count of 9)
        _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
        assertExpectedStatusUpdate(10, false);
        assertServiceInstanceStatus(9, 'myServiceType.1', false);
        assertServiceInstanceStatus(9, 'myServiceType.2', false);
    });

    it('disconnects service instance when underlying connection goes down', () => {
        connect();
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
        assertExpectedStatusUpdate(3, true);
        _stubAutobahnProxy.setIsConnected(false);
        assertExpectedStatusUpdate(4, false);
    });

    it('handles underlying connection bouncing before any heartbeats are received', () => {
        connect();
        _stubAutobahnProxy.setIsConnected(false);
        _stubAutobahnProxy.setIsConnected(true);
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        assertExpectedStatusUpdate(3, true);
        pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
        assertExpectedStatusUpdate(4, true);
    });

    it('disconnects then reconnect new service instance after underlying connection is bounced', () => {
        connect();
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
        assertExpectedStatusUpdate(3, true);
        assertServiceInstanceStatus(1, 'myServiceType.1', true);
        assertServiceInstanceStatus(2, 'myServiceType.1', true);
        _stubAutobahnProxy.setIsConnected(false);
        assertExpectedStatusUpdate(4, false);
        _stubAutobahnProxy.setIsConnected(true);
        pushServiceHeartbeat('myServiceType', 'myServiceType.4', 0);
        assertExpectedStatusUpdate(5, true);
        assertServiceInstanceStatus(4, 'myServiceType.4', true);
    });

    describe('createStreamOperation()', () => {
        let receivedPrices,
            receivedErrors,
            onCompleteCount,
            priceSubscriptionDisposable;

        beforeEach(() => {
            receivedPrices = [];
            receivedErrors = [];
            onCompleteCount = 0;
            priceSubscriptionDisposable = new Rx.SerialDisposable();
            subscribeToPriceStream();
        });

        it('publishes payload when underlying session receives payload', () => {
            connectAndPublishPrice();
            expect(receivedPrices.length).toEqual(1);
            expect(receivedPrices[0]).toEqual(1);
        });

        it('errors when service instance goes down (misses heartbeats)', () => {
            connectAndPublishPrice();
            expect(receivedErrors.length).toEqual(0);
            _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
            expect(receivedErrors.length).toEqual(1);
        });

        it('errors when underlying connection goes down', () => {
            connectAndPublishPrice();
            expect(receivedErrors.length).toEqual(0);
            _stubAutobahnProxy.setIsConnected(false);
            expect(receivedErrors.length).toEqual(1);
            _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT); // should have no effect, stream is dead
            expect(receivedErrors.length).toEqual(1);
        });

        it('still publishes payload to new subscribers after service instance comes back up', () => {
            connectAndPublishPrice();
            _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
            subscribeToPriceStream();
            pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
            pushPrice('myServiceType.1', 2);
            expect(receivedPrices.length).toEqual(2);
            expect(receivedPrices[0]).toEqual(1);
            expect(receivedPrices[1]).toEqual(2);
        });

        it('still publishes payload to new subscribers after underlying connection goes down and comes back', () => {
            connectAndPublishPrice();
            _stubAutobahnProxy.setIsConnected(false);
            expect(receivedErrors.length).toEqual(1);

            //setTimeout(() => {
                subscribeToPriceStream();
                _stubAutobahnProxy.setIsConnected(true);
                pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
                pushPrice('myServiceType.1', 2);
                expect(receivedPrices.length).toEqual(2);
                expect(receivedPrices[0]).toEqual(1);
                expect(receivedPrices[1]).toEqual(2);
          //  });


        });

        function subscribeToPriceStream() {
            var existing = priceSubscriptionDisposable.getDisposable();
            if(existing) {
                existing.dispose();
            }
            priceSubscriptionDisposable.setDisposable(
                _serviceClient.createStreamOperation('getPriceStream', 'EURUSD')
                    .subscribe(price => {
                            receivedPrices.push(price);
                        },
                        ex => receivedErrors.push(receivedErrors),
                        () => onCompleteCount++
                    )
            );
        }

        function connectAndPublishPrice() {
            connect();
            pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
            pushPrice('myServiceType.1', 1);
        }

        function pushPrice(serviceId :String,  price : Number) {
            var replyToTopic = _stubAutobahnProxy.session.getTopic(serviceId + '.getPriceStream').dto.replyTo;
            _stubAutobahnProxy.session.getTopic(replyToTopic).onResults(price);
        }
    });

    describe('createRequestResponseOperation()', () => {
        let responses,
            receivedErrors,
            onCompleteCount,
            requestSubscriptionDisposable;

        beforeEach(() => {
            responses = [];
            receivedErrors = [];
            onCompleteCount = 0;
            requestSubscriptionDisposable = new Rx.SerialDisposable();
        });

        it('sends response over wire when scribed to', () => {
            connect();
            pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
            sendRequest('RequestPayload', false);
            pushResponse('myServiceType.1', 'ResponsePayload')
        });
        
        function sendRequest(request, waitForSuitableService) {
            requestSubscriptionDisposable.setDisposable(
                _serviceClient.createRequestResponseOperation('executeTrade', request, waitForSuitableService)
                    .subscribe(response => {
                            responses.push(response);
                        },
                        ex => receivedErrors.push(receivedErrors),
                        () => onCompleteCount++
                    )
            );            
        }

        function pushResponse(serviceId :String,  response : Number) {
            var stubCallResult = _stubAutobahnProxy.session.getTopic(serviceId + '.executeTrade');
            stubCallResult.onSuccess(response);
        }
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