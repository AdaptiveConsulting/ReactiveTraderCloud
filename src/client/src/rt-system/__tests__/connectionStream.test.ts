import { createConnection$, WsConnection } from 'rt-system'
import { RxStompRPC, RxStomp } from '@stomp/rx-stomp'
import StompConfig from 'rt-system/StompConfig'

beforeEach(() => jest.clearAllMocks())

describe('createConnection$', () => {
  it('returns an observable object', () => {
    // arrange
    const mockConnection = new MockWsConnection()

    // act
    const connection = createConnection$(mockConnection)

    // assert
    expect(connection).toBeDefined()
    expect(connection).toHaveProperty('subscribe')
  })

  it('returns a cold observable', () => {
    // arrange
    const mockConnection: WsConnection = new MockWsConnection()

    // act
    createConnection$(mockConnection)

    // assert
    expect(mockConnection.open).toHaveBeenCalledTimes(0)
    expect(mockConnection.close).toHaveBeenCalledTimes(0)
    expect(mockConnection.onopen).toHaveBeenCalledTimes(0)
    expect(mockConnection.onclose).toHaveBeenCalledTimes(0)
  })
})

const MockWsConnection = jest.fn(
  (oncloseError?, willRetry?): WsConnection => {
    let onopenCallback: (x: any) => void
    let oncloseCallback: (reason: string, details: {}, willRetry: boolean) => void

    return {
      config: { brokerURL: 'FAKE', connectionType: 'websocket' } as StompConfig,
      rpcEndpoint: {} as RxStompRPC,
      streamEndpoint: new RxStomp(),
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
    }
  },
)
