import { Subscription } from 'rxjs/Rx'
import ServiceClient from '../../../src/system/service/serviceClient'
import Connection from '../../../src/system/service/connection'
import StubAutobahnProxy from './autobahnConnectionProxyStub'

let stubAutobahnProxy
let connection
let receivedServiceStatusStream
let serviceClient

describe('ServiceClient', () => {

  beforeEach(() => {
    stubAutobahnProxy = new StubAutobahnProxy()
    connection = new Connection('user', stubAutobahnProxy)
    serviceClient = new ServiceClient('myServiceType', connection)
    receivedServiceStatusStream = []
    serviceClient.serviceStatusStream.subscribe((statusSummary) => {
      receivedServiceStatusStream.push(statusSummary)
    })
  })

  test('yield a disconnect status before being opened', () => {
    assertExpectedStatusUpdate(1, false)
  })

  test('yields a connection status when matching service heartbeat is received', () => {
    connect()
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    assertExpectedStatusUpdate(2, true)
  })

  test('ignores heartbeats for unrelated services', () => {
    connect()
    pushServiceHeartbeat('booking', 'booking.1', 0)
    assertExpectedStatusUpdate(1, false)
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    assertExpectedStatusUpdate(2, true)
    pushServiceHeartbeat('execution', 'booking.1', 0)
    assertExpectedStatusUpdate(2, true)
  })

  test('doesn\'t push duplicate status updates', () => {
    connect()
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    assertExpectedStatusUpdate(2, true)
  })

  test('push a status update when load changes', () => {
    connect()
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0) // yields
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0) // gets ignored
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 1) // yields
    assertExpectedStatusUpdate(2, true)
  })

  test('groups heartbeats for service instances by service type', () => {
    connect()
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0)
    assertExpectedStatusUpdate(3, true)
    assertServiceInstanceStatus(2, 'myServiceType.1', true)
    assertServiceInstanceStatus(2, 'myServiceType.2', true)
  })

  test('disconnects service instance when underlying connection goes down', () => {
    connect()
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0)
    assertExpectedStatusUpdate(3, true)
    stubAutobahnProxy.setIsConnected(false)
    assertExpectedStatusUpdate(4, false)
  })

  test('handles underlying connection bouncing before any heartbeats are received', () => {
    connect()
    stubAutobahnProxy.setIsConnected(false)
    stubAutobahnProxy.setIsConnected(true)
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    assertExpectedStatusUpdate(3, true)
    pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0)
    assertExpectedStatusUpdate(4, true)
  })

  test('disconnects then reconnect new service instance after underlying connection is bounced', () => {
    connect()
    pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
    pushServiceHeartbeat('myServiceType', 'myServiceType.2', 0)
    assertExpectedStatusUpdate(3, true)
    assertServiceInstanceStatus(1, 'myServiceType.1', true)
    assertServiceInstanceStatus(2, 'myServiceType.1', true)
    stubAutobahnProxy.setIsConnected(false)
    assertExpectedStatusUpdate(4, false)
    stubAutobahnProxy.setIsConnected(true)
    pushServiceHeartbeat('myServiceType', 'myServiceType.4', 0)
    assertExpectedStatusUpdate(5, true)
    assertServiceInstanceStatus(4, 'myServiceType.4', true)
  })

  describe('createStreamOperation()', () => {
    let receivedPrices
    let receivedErrors
    let onCompleteCount
    let priceSubscriptionDisposable

    beforeEach(() => {
      receivedPrices = []
      receivedErrors = []
      onCompleteCount = 0
      priceSubscriptionDisposable = new Subscription()
      subscribeToPriceStream()
    })

    test('publishes payload when underlying session receives payload', () => {
      connectAndPublishPrice()
      expect(receivedPrices.length).toEqual(1)
      expect(receivedPrices[0]).toEqual(1)
    })

    test('errors when underlying connection goes down', () => {
      connectAndPublishPrice()
      expect(receivedErrors.length).toEqual(0)
      stubAutobahnProxy.setIsConnected(false)
      expect(receivedErrors.length).toEqual(1)
      expect(receivedErrors.length).toEqual(1)
    })

    test('still publishes payload to new subscribers after service instance comes back up', () => {
      connectAndPublishPrice()
      subscribeToPriceStream()
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
      pushPrice('myServiceType.1', 2)
      expect(receivedPrices.length).toEqual(2)
      expect(receivedPrices[0]).toEqual(1)
      expect(receivedPrices[1]).toEqual(2)
    })

    test('still publishes payload to new subscribers after underlying connection goes down and comes back', () => {
      connectAndPublishPrice()
      stubAutobahnProxy.setIsConnected(false)
      expect(receivedErrors.length).toEqual(1)

      subscribeToPriceStream()
      stubAutobahnProxy.setIsConnected(true)
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
      pushPrice('myServiceType.1', 2)
      expect(receivedPrices.length).toEqual(2)
      expect(receivedPrices[0]).toEqual(1)
      expect(receivedPrices[1]).toEqual(2)
    })

    function subscribeToPriceStream() {
      const existing = priceSubscriptionDisposable
      if (existing) {
        existing.unsubscribe()
      }
      priceSubscriptionDisposable.add(
        serviceClient.createStreamOperation('getPriceStream', 'EURUSD')
          .subscribe((price) => {
            receivedPrices.push(price)
          },
            err => receivedErrors.push(err),
            () => onCompleteCount++,
          ),
      )
    }

    function connectAndPublishPrice() {
      connect()
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
      pushPrice('myServiceType.1', 1)
    }

    function pushPrice(serviceId, price) {
      const replyToTopic = stubAutobahnProxy.session.getTopic(serviceId + '.getPriceStream').dto.replyTo
      stubAutobahnProxy.session.getTopic(replyToTopic).onResults(price)
    }
  })

  describe('createRequestResponseOperation()', () => {
    let responses
    let receivedErrors
    let onCompleteCount
    let requestSubscriptionDisposable

    beforeEach(() => {
      responses = []
      receivedErrors = []
      onCompleteCount = 0
      requestSubscriptionDisposable = new Subscription()
    })

    test('successfully sends request and receives response when connection is up', () => {
      connect()
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
      sendRequest('RequestPayload', false)
      pushSuccessfulResponse('myServiceType.1', 'ResponsePayload')
      expect(responses.length).toEqual(1)
      expect(responses[0]).toEqual('ResponsePayload')
    })

    test('successfully completes after response received', () => {
      connect()
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
      sendRequest('RequestPayload', false)
      pushSuccessfulResponse('myServiceType.1', 'ResponsePayload')
      expect(onCompleteCount).toEqual(1)
    })


    test('errors when underlying connection receives error', () => {
      const error = new Error('FakeRPCError')
      connect()
      pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
      sendRequest('RequestPayload', false)
      pushErrorResponse('myServiceType.1', error)
      expect(receivedErrors.length).toEqual(1)
      expect(receivedErrors[0]).toEqual(error)
    })

    describe('waitForSuitableService is true', () => {
      test('waits for service before sending request when connection is down', () => {
        sendRequest('RequestPayload', true)
        expect(receivedErrors.length).toEqual(0)
        connect()
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
        pushSuccessfulResponse('myServiceType.1', 'ResponsePayload')
        expect(responses.length).toEqual(1)
        expect(responses[0]).toEqual('ResponsePayload')
      })

      test('waits for service before sending request when connection is up but services are down', () => {
        connect()
        sendRequest('RequestPayload', true)
        expect(receivedErrors.length).toEqual(0)
        pushServiceHeartbeat('myServiceType', 'myServiceType.1', 0)
        pushSuccessfulResponse('myServiceType.1', 'ResponsePayload')
        expect(responses.length).toEqual(1)
        expect(responses[0]).toEqual('ResponsePayload')
      })
    })

    describe('waitForSuitableService is false', () => {
      test('errors when connection is down', () => {
        sendRequest('RequestPayload', false)
        expect(receivedErrors.length).toEqual(1)
        expect(receivedErrors[0]).toEqual(new Error('No service available'))
      })

      test('errors when connection is up but service status is down', () => {
        sendRequest('RequestPayload', false)
        connect()
        expect(receivedErrors.length).toEqual(1)
        expect(receivedErrors[0]).toEqual(new Error('No service available'))
      })
    })

    function sendRequest(request, waitForSuitableService) {
      requestSubscriptionDisposable.add(
        serviceClient.createRequestResponseOperation('executeTrade', request, waitForSuitableService)
          .subscribe(response => {
            responses.push(response)
          },
            err => receivedErrors.push(err),
            () => onCompleteCount++,
          ),
      )
    }

    function pushSuccessfulResponse(serviceId, response) {
      const stubCallResult = stubAutobahnProxy.session.getTopic(serviceId + '.executeTrade')
      stubCallResult.onSuccess(response)
    }

    function pushErrorResponse(serviceId, err) {
      const stubCallResult = stubAutobahnProxy.session.getTopic(serviceId + '.executeTrade')
      stubCallResult.onReject(err)
    }
  })

  function connect() {
    connection.connect()
    serviceClient.connect()
    stubAutobahnProxy.setIsConnected(true)
  }

  function pushServiceHeartbeat(serviceType, serviceId, instanceLoad = 0) {
    stubAutobahnProxy.session.getTopic('status').onResults({
      Type: serviceType,
      Instance: serviceId,
      TimeStamp: '',
      Load: instanceLoad,
    })
  }

  function assertExpectedStatusUpdate(expectedCount, lastStatusExpectedIsConnectedStatus) {
    expect(receivedServiceStatusStream.length).toEqual(expectedCount)
    if (expectedCount > 0) {
      expect(receivedServiceStatusStream[expectedCount - 1].isConnected).toEqual(lastStatusExpectedIsConnectedStatus)
    }
  }

  function assertServiceInstanceStatus(statusUpdateIndex, serviceId, expectedIsConnectedStatus) {
    const serviceStatus = receivedServiceStatusStream[statusUpdateIndex]
    expect(serviceStatus).toBeDefined()
  }
})
