import { ServiceClient, WsConnection } from 'rt-system'
import { RxStompRPC, RxStomp } from '@stomp/rx-stomp'
import { IMessage } from '@stomp/stompjs'
import { Observable } from 'rxjs'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('ServiceStub', () => {
  const Username = 'USER'

  describe('Request Response method', () => {
    const service = 'service'
    const operationName = 'operation'
    const payload = 'payload'
    const procedure = service + '.' + operationName

    it('invokes a remote procedure with the correct payload', () => {
      const rpcEndpoint = mockRpcEndpoint()
      const stub = new ServiceClient(Username, createMockConnection(rpcEndpoint))
      const rpc = stub
        .createRequestResponseOperation<string, string>(service, operationName, payload)
        .subscribe()

      expect(rpcEndpoint.rpc).lastCalledWith({
        destination: `/amq/queue/${procedure}`,
        body: JSON.stringify({
          payload,
          Username: Username,
        }),
      })
      rpc.unsubscribe()
    })
  })

  describe('Request Stream method', () => {
    const service = 'service'
    const operationName = 'operation'
    const payload = 'payload'
    const procedure = service + '.' + operationName

    it('invokes a remote procedure with the correct payload', () => {
      const rpcEndpoint = mockRpcEndpoint()
      const stub = new ServiceClient(Username, createMockConnection(rpcEndpoint))
      const rpc = stub
        .createStreamOperation<string, string>(service, operationName, payload)
        .subscribe()

      expect(rpcEndpoint.stream).lastCalledWith({
        destination: `/amq/queue/${procedure}`,
        body: JSON.stringify({
          payload,
          Username: Username,
        }),
      })
      rpc.unsubscribe()
    })
  })

  describe('Subscribe To Topic method', () => {
    const topic = 'someTopic'
    it('subscribes to the correct topic name', () => {
      const streamEndpoint = mockStreamEndpoint()
      const stub = new ServiceClient(Username, createMockConnection(undefined, streamEndpoint))
      stub.subscribeToTopic(topic).subscribe()
      expect(streamEndpoint.watch).lastCalledWith(`/exchange/${topic}`)
    })
  })
})

const createMockConnection: (rpcEndpoint?: RxStompRPC, streamEndpoint?: RxStomp) => WsConnection = (
  rpcEndpoint: RxStompRPC = mockRpcEndpoint(),
  streamEndpoint: RxStomp = mockStreamEndpoint()
) => ({
  config: { brokerURL: 'FAKE', connectionType: 'websocket', reconnectDelay: 100 },
  rpcEndpoint: rpcEndpoint,
  streamEndpoint: streamEndpoint,
  open: jest.fn().mockReturnValue(true),
  close: jest.fn(),
  onopen: jest.fn(),
  onclose: jest.fn(),
})

const mockRpcEndpoint = () => {
  return ({
    rpc: jest.fn().mockReturnValue(new Observable<IMessage>()),
    stream: jest.fn().mockReturnValue(new Observable<IMessage>()),
  } as any) as RxStompRPC
}

const mockStreamEndpoint = () => {
  return ({
    watch: jest.fn().mockReturnValue(new Observable<IMessage>()),
  } as any) as RxStomp
}
