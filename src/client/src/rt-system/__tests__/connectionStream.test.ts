import { connectionStream$, WsConnection } from 'rt-system'
import { RxStompRPC, RxStomp } from '@stomp/rx-stomp'

beforeEach(() => jest.clearAllMocks())

describe('connectionStream$', () => {
  it('returns an observable object', () => {
    // arrange
    const mockConnection = jest.fn(
      (): WsConnection => {
        return {
          config: { brokerURL: 'FAKE', reconnectDelay: 200 },
          rpcEndpoint: {} as RxStompRPC,
          streamEndpoint: new RxStomp(),
        }
      }
    )

    // act
    const connection = connectionStream$(mockConnection())

    // assert
    expect(connection).toBeDefined()
    expect(connection).toHaveProperty('subscribe')
  })
})
