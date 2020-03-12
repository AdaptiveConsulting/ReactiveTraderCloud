import { AutobahnSessionProxy, ConnectionEvent, ServiceStub, AutobahnConnection } from 'rt-system'
import { MockScheduler } from 'rt-testing'
import { RxStompRPC, RxStomp } from '@stomp/rx-stomp'
import { IMessage } from '@stomp/stompjs'
import { Observable } from 'rxjs'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('ServiceStub', () => {
  const Username = 'USER'

  describe('Request Response method', () => {
    const procedure = 'procedure'
    const payload = 'payload'
    const replyTo = 'responseTopic'

    it('invokes a remote procedure with the correct payload', () => {
      const rpcEndpoint = new MockRpcEndpoint()
      const stub = new ServiceStub(Username, createMockConnection(rpcEndpoint))
      const rpc = stub.requestResponse<string, string>(procedure, payload, replyTo).subscribe()

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
    const procedure = 'procedure'
    const payload = 'payload'

    it('invokes a remote procedure with the correct payload', () => {
      const rpcEndpoint = new MockRpcEndpoint()
      const stub = new ServiceStub(Username, createMockConnection(rpcEndpoint))
      const rpc = stub.requestStream<string, string>(procedure, payload).subscribe()

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
    let variables: {}

    beforeEach(() => {
      variables = {
        c: createMockConnection(),
        1: 'result1',
        2: 'result2',
        3: 'result3',
      }
    })

    const topic = 'someTopic'
    it('subscribes to the correct topic name', () => {
      const streamEndpoint = new MockStreamEndpoint()
      const stub = new ServiceStub(Username, createMockConnection(undefined, streamEndpoint))
      stub.subscribeToTopic(topic).subscribe()
      expect(streamEndpoint.watch).lastCalledWith(`/exchange/${topic}`)
    })

    xit('streams topic results', () => {
      new MockScheduler().run(({ expectObservable }) => {
        const streamEndpoint = new MockStreamEndpoint()
        const stub = new ServiceStub(Username, createMockConnection(undefined, streamEndpoint))
        const expected = '--(123)'
        const topicSubscription$ = stub.subscribeToTopic(topic)
        expectObservable(topicSubscription$).toBe(expected, variables)
      })
    })

    xit('Observable topic errors when an acknowledgement fails', () => {
      new MockScheduler().run(({ cold, expectObservable }) => {
        const streamEndpoint = new MockStreamEndpoint()
        const stub = new ServiceStub(Username, createMockConnection(undefined, streamEndpoint))
        const topicSubscription$ = stub.subscribeToTopic(FAILURE_TOPIC)
        expectObservable(topicSubscription$).toBe('--#', variables, topicError)
      })
    })
  })
})

const createMockConnection: (
  rpcEndpoint?: RxStompRPC,
  streamEndpoint?: RxStomp,
) => AutobahnConnection = (
  rpcEndpoint: RxStompRPC = new MockRpcEndpoint(),
  streamEndpoint: RxStomp = new MockStreamEndpoint(),
) => ({
  rpcEndpoint: rpcEndpoint,
  streamEndpoint: streamEndpoint,
  session: {} as AutobahnSessionProxy,
  open: jest.fn().mockReturnValue(true),
  close: jest.fn(),
  getConnection: jest.fn<any, any>(),
  onopen: jest.fn(),
  onclose: jest.fn(),
})

const FAILURE_TOPIC = 'FAILURE_TOPIC'
const topicError = new Error('failure')

const MockRpcEndpoint = jest.fn<any, any>(() => {
  return {
    rpc: jest.fn().mockReturnValue(new Observable<IMessage>()),
    stream: jest.fn().mockReturnValue(new Observable<IMessage>()),
  }
})

const MockStreamEndpoint = jest.fn<any, any>(() => {
  return {
    watch: jest.fn().mockReturnValue(new Observable<IMessage>()),
  }
})
