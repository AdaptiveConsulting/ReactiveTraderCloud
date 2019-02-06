import {
  AutobahnSessionProxy,
  ConnectionEvent,
  ConnectionEventType,
  ConnectionType,
  ConnectionOpenEvent,
} from 'rt-system'
import { MockScheduler } from 'rt-testing'
import { ServiceStub } from 'rt-system'
import { of } from 'rxjs'

const createMockConnection: (session: AutobahnSessionProxy) => ConnectionOpenEvent = (
  session: AutobahnSessionProxy,
) => ({
  type: ConnectionEventType.CONNECTED,
  session,
  url: 'FAKE',
  transportType: ConnectionType.LongPolling,
})

describe('ServiceStub', () => {
  const payload = 'payload'
  const replyTo = 'responseTopic'
  const Username = 'USER'
  const procedure = 'procedure'
  const result = 'result'

  describe('Request Response', () => {
    it('invokes the a remote procedure with the correct payload', () => {
      const session = new MockSession()
      const stub = new ServiceStub(Username, of(createMockConnection(session)))
      const rpc = stub.requestResponse<string, string>(procedure, payload, replyTo).subscribe()
      expect(session.call).lastCalledWith(procedure, [{ payload, replyTo, Username }])
      rpc.unsubscribe()
    })

    it('does not make a request until a connection is established', () => {
      new MockScheduler().run(({ cold, expectObservable }) => {
        const connection$ = cold<ConnectionEvent>('-')
        const stub = new ServiceStub(Username, connection$)
        const expected = '-'
        const topicSubscription$ = stub.requestResponse<string, string>(procedure, payload, replyTo)
        expectObservable(topicSubscription$).toBe(expected)
      })
    })

    it('returns the result and completes after a connection is established', () => {
      new MockScheduler().run(({ cold, expectObservable }) => {
        const variables = { c: createMockConnection(new MockSession()), r: result }

        //emit connection event after two frames
        const connection$ = cold<ConnectionEvent>('--c', variables)
        const stub = new ServiceStub(Username, connection$)
        const expected = '--(r|)'
        const topicSubscription$ = stub.requestResponse<string, string>(procedure, payload, replyTo)
        expectObservable(topicSubscription$).toBe(expected, variables)
      })
    })
  })
})

const MockSession = jest.fn<AutobahnSessionProxy>(() => {
  return {
    isOpen: jest.fn<any>(),
    subscribe: jest.fn<any>(),
    unsubscribe: jest.fn<any>(),
    call: jest.fn<any>().mockReturnValue({
      then: (cb: (result: string) => {}) => {
        cb('result')
      },
    }),
  }
})
