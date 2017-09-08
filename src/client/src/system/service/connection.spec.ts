import StubAutobahnProxy from './autobahnConnectionProxyStub'
import Connection from '../../../src/system/service/connection'
import { ConnectionStatus } from '../../../src/types/'

describe('Connection', () => {
  
  let stubAutobahnProxy
  let connection
  let receivedStatusUpdates

  beforeEach(() => {
    stubAutobahnProxy = new StubAutobahnProxy()
    connection = new Connection('user', stubAutobahnProxy)
    receivedStatusUpdates = []
    connection.connectionStatusStream.subscribe((isConnected) => {
      receivedStatusUpdates.push(isConnected)
    })
  })

  test('subscribes to autobahn open on connect()', () => {
    connection.connect()
    expect(stubAutobahnProxy.onOpenCallbacks.length).toEqual(1)
  })

  test('subscribes to autobahn close on connect()', () => {
    connection.connect()
    expect(stubAutobahnProxy.onCloseCallbacks.length).toEqual(1)
  })

  test('only opens underlying once when you call .connect()', () => {
    connection.connect()
    connection.connect()
    connection.connect()
    expect(stubAutobahnProxy.onOpenCallbacks.length).toEqual(1)
  })

  test('pumps connection status of idle on initial connect before open', () => {
    expect(receivedStatusUpdates.length).toEqual(1)
    expect(receivedStatusUpdates).toEqual([ConnectionStatus.idle])
  })

  test('pumps connection status of connected when connection comes up', () => {
    connection.connect()

    stubAutobahnProxy.setIsConnected(true)
    expect(receivedStatusUpdates.length).toEqual(2)
    expect(receivedStatusUpdates).toEqual([
      ConnectionStatus.idle,
      ConnectionStatus.connected,
    ])
  })

  test('pumps connection status of disconnected when connection goes down', () => {
    connection.connect()
    stubAutobahnProxy.setIsConnected(true)
    stubAutobahnProxy.setIsConnected(false)
    expect(receivedStatusUpdates.length).toEqual(3)
    expect(receivedStatusUpdates).toEqual([
      ConnectionStatus.idle,
      ConnectionStatus.connected,
      ConnectionStatus.disconnected,
    ])
  })

  test('errors if called before session is set', () => {
    let streamYieldCount = 0
    let receivedError
    connection.subscribeToTopic('status').subscribe((_) => {
      streamYieldCount++
    }, (ex) => {
      receivedError = ex
    })
    expect(streamYieldCount).toEqual(0)
    expect(receivedError).toBeDefined()
    expect(receivedError.error).toEqual('Session not connected, can\'t subscribe to topic [status]')
  })
})
