import { Observer } from 'rxjs'
import { createConnection$, AutobahnConnection, ConnectionEventType } from 'rt-system'
import { Connection } from 'autobahn'

beforeEach(() => jest.clearAllMocks())

describe('createConnection$', () => {
  it('returns an observable object', () => {
    // arrange
    const mockConnection = new MockAutobahnConnection()

    // act
    const connection = createConnection$(mockConnection)

    // assert
    expect(connection).toBeDefined()
    expect(connection).toHaveProperty('subscribe')
  })

  it('returns a cold observable', () => {
    // arrange
    const mockConnection = new MockAutobahnConnection()

    // act
    createConnection$(mockConnection)

    // assert
    expect(mockConnection.open).toHaveBeenCalledTimes(0)
    expect(mockConnection.close).toHaveBeenCalledTimes(0)
    expect(mockConnection.onopen).toHaveBeenCalledTimes(0)
    expect(mockConnection.onclose).toHaveBeenCalledTimes(0)
  })

  it('returns an observable that calls open on subscribe', () => {
    // arrange
    const mockConnection = new MockAutobahnConnection()

    // act
    createConnection$(mockConnection).subscribe()

    // assert
    expect(mockConnection.open).toHaveBeenCalledTimes(1)
    expect(mockConnection.close).toHaveBeenCalledTimes(0)
  })

  it('returns an observable that calls close on unsubscribe', () => {
    // arrange
    const mockConnection = new MockAutobahnConnection()

    // act
    createConnection$(mockConnection)
      .subscribe()
      .unsubscribe()

    // assert
    expect(mockConnection.close).toHaveBeenCalledTimes(1)
  })

  it('returns an observable that receives an onopen notification when open is called', () => {
    // arrange
    const mockConnection = new MockAutobahnConnection()
    const onNext = jest.fn()

    // act
    createConnection$(mockConnection).subscribe(onNext)

    // assert
    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onNext).toHaveBeenCalledWith({
      type: ConnectionEventType.CONNECTED,
      url: 'FAKE',
      transportType: 'websocket',
    })
  })

  it('returns an observable that is completed when onclose is called without indicating that the service will retry', () => {
    // arrange
    const mockConnection = new MockAutobahnConnection()
    const mockObserver = new MockObserver()

    // act
    createConnection$(mockConnection).subscribe(mockObserver)
    mockConnection.close()

    // assert
    expect(mockConnection.onclose).toHaveBeenCalledTimes(1)
    expect(mockObserver.complete).toHaveBeenCalledTimes(1)
  })

  it('returns an observable that terminates with an error when onclose is called with an error', () => {
    // arrange
    const mockConnection = new MockAutobahnConnection(true)
    const mockObserver = new MockObserver()

    // act
    createConnection$(mockConnection).subscribe(mockObserver)
    mockConnection.close()

    // assert
    expect(mockConnection.onclose).toHaveBeenCalledTimes(1)
    expect(mockObserver.error).toHaveBeenCalledTimes(1)
    expect(mockObserver.error).toHaveBeenCalledWith({
      reason: 'failed',
      details: {
        message: 'FAILED',
      },
    })
  })

  it('returns an observable that contains a disconnected notification when onclose is called, indicating that the service will retry', () => {
    // arrange
    const mockConnection = new MockAutobahnConnection(false, true)
    const mockObserver = new MockObserver()

    // act
    createConnection$(mockConnection).subscribe(mockObserver)
    mockConnection.close()

    // assert
    expect(mockConnection.onclose).toHaveBeenCalledTimes(1)
    expect(mockObserver.next).toHaveBeenCalledTimes(2)
    expect(mockObserver.next).toHaveBeenLastCalledWith({
      type: ConnectionEventType.DISCONNECTED,
      reason: 'lost',
      details: 'SUCCESS',
    })
  })

  it('returns an observable that contains a connected notification when onclose is called and then onopen is called', () => {
    // arrange
    const mockConnection = new MockAutobahnConnection(false, true)
    const mockObserver = new MockObserver()

    // act
    createConnection$(mockConnection).subscribe(mockObserver)
    mockConnection.close()
    mockConnection.open()

    // assert
    expect(mockConnection.onclose).toHaveBeenCalledTimes(1)
    expect(mockConnection.onopen).toHaveBeenCalledTimes(1)
    expect(mockObserver.next).toHaveBeenCalledTimes(3)
    expect(mockObserver.next).toHaveBeenLastCalledWith({
      type: ConnectionEventType.CONNECTED,
      url: 'FAKE',
      transportType: 'websocket',
    })
  })
})

const MockAutobahnConnection = jest.fn<AutobahnConnection>((oncloseError, willRetry) => {
  let onopenCallback: (x: any) => void
  let oncloseCallback: (reason: string, details: {}, willRetry: boolean) => void

  return {
    onopen: jest.fn(cb => (onopenCallback = cb)).mockName('onopen'),
    onclose: jest.fn(cb => (oncloseCallback = cb)).mockName('onclose'),
    open: jest
      .fn(() => {
        if (onopenCallback) {
          onopenCallback(undefined)
        }
        return true
      })
      .mockName('open'),
    close: jest
      .fn(
        () =>
          oncloseCallback &&
          oncloseCallback(
            willRetry ? 'lost' : !oncloseError ? 'closed' : 'failed',
            {
              message: !oncloseError ? 'SUCCESS' : 'FAILED',
            },
            willRetry,
          ),
      )
      .mockName('close'),
    getConnection: jest.fn<Connection>(() => ({
      transport: {
        info: {
          type: 'websocket',
          url: 'FAKE',
        },
      },
    })),
  }
})

const MockObserver = jest.fn<Observer<any>>(() => ({
  next: jest.fn(),
  error: jest.fn(),
  complete: jest.fn(),
}))
