import { Subscription } from 'rxjs/Rx';
import ServiceClient from '../../../src/system/service/serviceClient';
import Connection from '../../../src/system/service/connection';
import SchedulerService from '../../../src/system/schedulerService';
import StubAutobahnProxy from './autobahnConnectionProxyStub';

let _stubAutobahnProxy,
  _connection,
  _receivedServiceStatusStream,
  _serviceClient;

describe('ServiceClient', () => {

  beforeEach(() => {
    _stubAutobahnProxy = new StubAutobahnProxy();
    _connection = new Connection('user', _stubAutobahnProxy, new SchedulerService());
    _serviceClient = new ServiceClient('myServiceType', _connection, new SchedulerService());
    _receivedServiceStatusStream = [];
    _serviceClient.serviceStatusStream.subscribe(statusSummary => {
      _receivedServiceStatusStream.push(statusSummary);
    });
  });

  test('yield a disconnect status before being opened', () => {
    assertExpectedStatusUpdate(1, false);
  });

  test('yields a connection status when matching service heartbeat is received', () => {
    connect();
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    assertExpectedStatusUpdate(2, true);
  });

  test('ignores heartbeats for unrelated services', () => {
    connect();
    pushServiceHeartbeat('booking', 'booking.1', 0);
    assertExpectedStatusUpdate(1, false);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    assertExpectedStatusUpdate(2, true);
    pushServiceHeartbeat('execution', 'booking.1', 0);
    assertExpectedStatusUpdate(2, true);
  });

  test('doesn\'t push duplicate status updates', () => {
    connect();
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    assertExpectedStatusUpdate(2, true);
  });

  test('push a status update when load changes', () => {
    connect();
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0); // yields
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0); // gets ignored
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 1); // yields
    assertExpectedStatusUpdate(2, true);
  });

  test('groups heartbeats for service instances by service type', () => {
    connect();
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
    assertExpectedStatusUpdate(3, true);
    assertServiceInstanceStatus(2, 'myServiceType.1', true);
    assertServiceInstanceStatus(2, 'myServiceType.2', true);
  });

  test('disconnects service instance when underlying connection goes down', () => {
    connect();
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
    assertExpectedStatusUpdate(3, true);
    _stubAutobahnProxy.setIsConnected(false);
    assertExpectedStatusUpdate(4, false);
  });

  test('handles underlying connection bouncing before any heartbeats are received', () => {
    connect();
    _stubAutobahnProxy.setIsConnected(false);
    _stubAutobahnProxy.setIsConnected(true);
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
    assertExpectedStatusUpdate(3, true);
    pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0);
    assertExpectedStatusUpdate(4, true);
  });

  test('disconnects then reconnect new service instance after underlying connection is bounced', () => {
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
      _priceSubscriptionDisposable = new Subscription();
      subscribeToPriceStream();
    });

    test('publishes payload when underlying session receives payload', () => {
      connectAndPublishPrice();
      expect(_receivedPrices.length).toEqual(1);
      expect(_receivedPrices[0]).toEqual(1);
    });

    test('errors when underlying connection goes down', () => {
      connectAndPublishPrice();
      expect(_receivedErrors.length).toEqual(0);
      _stubAutobahnProxy.setIsConnected(false);
      expect(_receivedErrors.length).toEqual(1);
      expect(_receivedErrors.length).toEqual(1);
    });

    test('still publishes payload to new subscribers after service instance comes back up', () => {
      connectAndPublishPrice();
      // _scheduler.advanceBy(ServiceClient.HEARTBEAT_TIMEOUT);
      subscribeToPriceStream();
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      pushPrice('myServiceType.1', 2);
      expect(_receivedPrices.length).toEqual(2);
      expect(_receivedPrices[0]).toEqual(1);
      expect(_receivedPrices[1]).toEqual(2);
    });

    test('still publishes payload to new subscribers after underlying connection goes down and comes back', () => {
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
      var existing = _priceSubscriptionDisposable;
      if (existing) {
        existing.dispose();
      }
      _priceSubscriptionDisposable.add(
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

    function pushPrice(serviceId, price) {
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
      _requestSubscriptionDisposable = new Subscription();
    });

    test('successfully sends request and receives response when connection is up', () => {
      connect();
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      sendRequest('RequestPayload', false);
      pushSuccessfulResponse('myServiceType.1', 'ResponsePayload');
      expect(_responses.length).toEqual(1);
      expect(_responses[0]).toEqual('ResponsePayload');
    });

    test('successfully completes after response received', () => {
      connect();
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      sendRequest('RequestPayload', false);
      pushSuccessfulResponse('myServiceType.1', 'ResponsePayload');
      expect(_onCompleteCount).toEqual(1);
    });


    test('errors when underlying connection receives error', () => {
      const error = new Error('FakeRPCError');
      connect();
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
      sendRequest('RequestPayload', false);
      pushErrorResponse('myServiceType.1', error);
      expect(_receivedErrors.length).toEqual(1);
      expect(_receivedErrors[0]).toEqual(error);
    });

    describe('waitForSuitableService is true', () => {
      test('waits for service before sending request when connection is down', () => {
        sendRequest('RequestPayload', true);
        expect(_receivedErrors.length).toEqual(0);
        connect();
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0);
        pushSuccessfulResponse('myServiceType.1', 'ResponsePayload')
        expect(_responses.length).toEqual(1);
        expect(_responses[0]).toEqual('ResponsePayload');
      });

      test('waits for service before sending request when connection is up but services are down', () => {
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
      test('errors when connection is down', () => {
        sendRequest('RequestPayload', false);
        expect(_receivedErrors.length).toEqual(1);
        expect(_receivedErrors[0]).toEqual(new Error('No service available'));
      });

      test('errors when connection is up but service status is down', () => {
        sendRequest('RequestPayload', false);
        connect();
        expect(_receivedErrors.length).toEqual(1);
        expect(_receivedErrors[0]).toEqual(new Error('No service available'));
      });
    });

    function sendRequest(request, waitForSuitableService) {
      _requestSubscriptionDisposable.add(
        _serviceClient.createRequestResponseOperation('executeTrade', request, waitForSuitableService)
          .subscribe(response => {
              _responses.push(response);
            },
            err => _receivedErrors.push(err),
            () => _onCompleteCount++
          )
      );
    }

    function pushSuccessfulResponse(serviceId, response) {
      var stubCallResult = _stubAutobahnProxy.session.getTopic(serviceId + '.executeTrade');
      stubCallResult.onSuccess(response);
    }

    function pushErrorResponse(serviceId, err) {
      var stubCallResult = _stubAutobahnProxy.session.getTopic(serviceId + '.executeTrade');
      stubCallResult.onReject(err);
    }
  });

  function connect() {
    _connection.connect();
    _serviceClient.connect();
    _stubAutobahnProxy.setIsConnected(true);
  }

  function pushServiceHeartbeat(serviceType, serviceId, instanceLoad = 0) {
    _stubAutobahnProxy.session.getTopic('status').onResults({
      Type: serviceType,
      Instance: serviceId,
      TimeStamp: '',
      Load: instanceLoad
    });
  }

  function assertExpectedStatusUpdate(expectedCount, lastStatusExpectedIsConnectedStatus) {
    expect(_receivedServiceStatusStream.length).toEqual(expectedCount);
    if (expectedCount > 0) {
      expect(_receivedServiceStatusStream[expectedCount - 1].isConnected).toEqual(lastStatusExpectedIsConnectedStatus);
    }
  }

  function assertServiceInstanceStatus(statusUpdateIndex, serviceId, expectedIsConnectedStatus) {
    var serviceStatus = _receivedServiceStatusStream[statusUpdateIndex];
    expect(serviceStatus).toBeDefined();
    var instanceStatus = serviceStatus.getInstanceStatus(serviceId);
    expect(instanceStatus).toBeDefined();
    expect(instanceStatus.isConnected).toEqual(expectedIsConnectedStatus);
  }
});
