import Rx from 'rx';
import system from 'system';
import StubAutobahnProxy from './stubAutobahnProxy';

describe('ServiceClient', () => {
  let _stubAutobahnProxy:StubAutobahnProxy,
    _connection:system.service.Connection,
    _receivedServiceStatusStream:Array<system.service.ServiceStatus>,
    _serviceClient:system.service.ServiceClient,
    _scheduler:system.SchedulerService;

  beforeEach(() => {
    _scheduler = new Rx.HistoricalScheduler();
    _stubAutobahnProxy = new StubAutobahnProxy();
    var stubSchedulerService = {
      async: _scheduler
    }
    _connection = new system.service.Connection('user', _stubAutobahnProxy, stubSchedulerService);
    _serviceClient = new system.service.ServiceClient('myServiceType', _connection, stubSchedulerService);
    _receivedServiceStatusStream = [];
    _serviceClient.serviceStatusStream.subscribe(statusSummary => {
      _receivedServiceStatusStream.push(statusSummary);
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

  it('doesn\'t push duplicate status updates', () => {
    connect();
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    assertExpectedStatusUpdate(2, true);
  });

  it('push a status update when load changes', () => {
    connect();
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0); // yields
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0); // gets ignored
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 1); // yields
    assertExpectedStatusUpdate(3, true);
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

    // keep myServiceType.2 alive, not it won't actually yield as it's just maintain
    // it's status, however it should stop it from timing out
    pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
    assertExpectedStatusUpdate(3, true);

    // disconnect myServiceType.1 by moving the schedule past the time out interval
    _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
    assertExpectedStatusUpdate(4, true);
    assertServiceInstanceStatus(3, 'myServiceType.1', false);
    assertServiceInstanceStatus(3, 'myServiceType.2', true);

    // again move the schedule forward, since now heartbeat from myServiceType.2 has been missed that'll disconnect
    _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT / 2);
    assertExpectedStatusUpdate(5, false);
    assertServiceInstanceStatus(4, 'myServiceType.1', false);
    assertServiceInstanceStatus(4, 'myServiceType.2', false);

    // reconnect myServiceType 2
    pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
    assertExpectedStatusUpdate(6, true);
    assertServiceInstanceStatus(5, 'myServiceType.1', false);
    assertServiceInstanceStatus(5, 'myServiceType.2', true);

    // reconnect myServiceType 1
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    assertExpectedStatusUpdate(7, true);
    assertServiceInstanceStatus(6, 'myServiceType.1', true);
    assertServiceInstanceStatus(6, 'myServiceType.2', true);

    // disconnect both, each will cause a separate yield as each service instance get processed independently (thus the count of 9)
    _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
    assertExpectedStatusUpdate(9, false);
    assertServiceInstanceStatus(8, 'myServiceType.1', false);
    assertServiceInstanceStatus(8, 'myServiceType.2', false);
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
    let _receivedPrices,
      _receivedErrors,
      _onCompleteCount,
      _priceSubscriptionDisposable;

    beforeEach(() => {
      _receivedPrices = [];
      _receivedErrors = [];
      _onCompleteCount = 0;
      _priceSubscriptionDisposable = new Rx.SerialDisposable();
      subscribeToPriceStream();
    });

    it('publishes payload when underlying session receives payload', () => {
      connectAndPublishPrice();
      expect(_receivedPrices.length).toEqual(1);
      expect(_receivedPrices[0]).toEqual(1);
    });

    it('errors when service instance goes down (misses heartbeats)', () => {
      connectAndPublishPrice();
      expect(_receivedErrors.length).toEqual(0);
      _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
      expect(_receivedErrors.length).toEqual(1);
    });

    it('errors when underlying connection goes down', () => {
      connectAndPublishPrice();
      expect(_receivedErrors.length).toEqual(0);
      _stubAutobahnProxy.setIsConnected(false);
      expect(_receivedErrors.length).toEqual(1);
      _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT); // should have no effect, stream is dead
      expect(_receivedErrors.length).toEqual(1);
    });

    it('still publishes payload to new subscribers after service instance comes back up', () => {
      connectAndPublishPrice();
      _scheduler.advanceBy(system.service.ServiceClient.HEARTBEAT_TIMEOUT);
      subscribeToPriceStream();
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      pushPrice('myServiceType.1', 2);
      expect(_receivedPrices.length).toEqual(2);
      expect(_receivedPrices[0]).toEqual(1);
      expect(_receivedPrices[1]).toEqual(2);
    });

    it('still publishes payload to new subscribers after underlying connection goes down and comes back', () => {
      connectAndPublishPrice();
      _stubAutobahnProxy.setIsConnected(false);
      expect(_receivedErrors.length).toEqual(1);

      subscribeToPriceStream();
      _stubAutobahnProxy.setIsConnected(true);
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      pushPrice('myServiceType.1', 2);
      expect(_receivedPrices.length).toEqual(2);
      expect(_receivedPrices[0]).toEqual(1);
      expect(_receivedPrices[1]).toEqual(2);
    });

    function subscribeToPriceStream() {
      var existing = _priceSubscriptionDisposable.getDisposable();
      if (existing) {
        existing.dispose();
      }
      _priceSubscriptionDisposable.setDisposable(
        _serviceClient.createStreamOperation('getPriceStream', 'EURUSD')
          .subscribe(price => {
              _receivedPrices.push(price);
            },
            err => _receivedErrors.push(err),
            () => _onCompleteCount++
          )
      );
    }

    function connectAndPublishPrice() {
      connect();
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      pushPrice('myServiceType.1', 1);
    }

    function pushPrice(serviceId:String, price:Number) {
      var replyToTopic = _stubAutobahnProxy.session.getTopic(serviceId + '.getPriceStream').dto.replyTo;
      _stubAutobahnProxy.session.getTopic(replyToTopic).onResults(price);
    }
  });

  describe('createRequestResponseOperation()', () => {
    let _responses,
      _receivedErrors,
      _onCompleteCount,
      _requestSubscriptionDisposable;

    beforeEach(() => {
      _responses = [];
      _receivedErrors = [];
      _onCompleteCount = 0;
      _requestSubscriptionDisposable = new Rx.SerialDisposable();
    });

    it('successfully sends request and receives response when connection is up', () => {
      connect();
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      sendRequest('RequestPayload', false);
      pushSuccessfulResponse('myServiceType.1', 'ResponsePayload');
      expect(_responses.length).toEqual(1);
      expect(_responses[0]).toEqual('ResponsePayload');
    });

    it('successfully completes after response received', () => {
      connect();
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      sendRequest('RequestPayload', false);
      pushSuccessfulResponse('myServiceType.1', 'ResponsePayload');
      expect(_onCompleteCount).toEqual(1);
    });


    it('errors when underlying connection receives error', () => {
      const error = new Error("FakeRPCError");
      connect();
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      sendRequest('RequestPayload', false);
      pushErrorResponse('myServiceType.1', error);
      expect(_receivedErrors.length).toEqual(1);
      expect(_receivedErrors[0]).toEqual(error);
    });

    describe('waitForSuitableService is true', () => {
      it('waits for service before sending request when connection is down', () => {
        sendRequest('RequestPayload', true);
        expect(_receivedErrors.length).toEqual(0);
        connect();
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        pushSuccessfulResponse('myServiceType.1', 'ResponsePayload')
        expect(_responses.length).toEqual(1);
        expect(_responses[0]).toEqual('ResponsePayload');
      });

      it('waits for service before sending request when connection is up but services are down', () => {
        connect();
        sendRequest('RequestPayload', true);
        expect(_receivedErrors.length).toEqual(0);
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        pushSuccessfulResponse('myServiceType.1', 'ResponsePayload')
        expect(_responses.length).toEqual(1);
        expect(_responses[0]).toEqual('ResponsePayload');
      });
    });

    describe('waitForSuitableService is false', () => {
      it('errors when connection is down', () => {
        sendRequest('RequestPayload', false);
        expect(_receivedErrors.length).toEqual(1);
        expect(_receivedErrors[0]).toEqual(new Error('No service available'));
      });

      it('errors when connection is up but service status is down', () => {
        sendRequest('RequestPayload', false);
        connect();
        expect(_receivedErrors.length).toEqual(1);
        expect(_receivedErrors[0]).toEqual(new Error('No service available'));
      });
    });

    function sendRequest(request, waitForSuitableService) {
      _requestSubscriptionDisposable.setDisposable(
        _serviceClient.createRequestResponseOperation('executeTrade', request, waitForSuitableService)
          .subscribe(response => {
              _responses.push(response);
            },
            err => _receivedErrors.push(err),
            () => _onCompleteCount++
          )
      );
    }

    function pushSuccessfulResponse(serviceId:String, response:Number) {
      var stubCallResult = _stubAutobahnProxy.session.getTopic(serviceId + '.executeTrade');
      stubCallResult.onSuccess(response);
    }

    function pushErrorResponse(serviceId:String, err:Error) {
      var stubCallResult = _stubAutobahnProxy.session.getTopic(serviceId + '.executeTrade');
      stubCallResult.onReject(err);
    }
  });

  function connect() {
    _connection.connect();
    _serviceClient.connect();
    _stubAutobahnProxy.setIsConnected(true);
  }

  function pushServiceHeartbeat(serviceType:String, serviceId:String, instanceLoad:Number = 0) {
    _stubAutobahnProxy.session.getTopic('status').onResults({
      Type: serviceType,
      Instance: serviceId,
      TimeStamp: '',
      Load: instanceLoad
    });
  }

  function assertExpectedStatusUpdate(expectedCount:Number, lastStatusExpectedIsConnectedStatus:Boolean) {
    expect(_receivedServiceStatusStream.length).toEqual(expectedCount);
    if (expectedCount > 0) {
      expect(_receivedServiceStatusStream[expectedCount - 1].isConnected).toEqual(lastStatusExpectedIsConnectedStatus);
    }
  }

  function assertServiceInstanceStatus(statusUpdateIndex:Number, serviceId:String, expectedIsConnectedStatus:Boolean) {
    var serviceStatus = _receivedServiceStatusStream[statusUpdateIndex];
    expect(serviceStatus).toBeDefined('Can\'t find service status summary at index ' + statusUpdateIndex);
    var instanceStatus = serviceStatus.getInstanceStatus(serviceId);
    expect(instanceStatus).toBeDefined();
    expect(instanceStatus.isConnected).toEqual(expectedIsConnectedStatus);
  }
});
