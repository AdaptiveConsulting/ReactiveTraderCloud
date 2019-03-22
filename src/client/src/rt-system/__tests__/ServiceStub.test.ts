import {
  AutobahnSessionProxy,
  ConnectionEvent,
  ConnectionEventType,
  ConnectionOpenEvent,
} from 'rt-system'
import { MockScheduler } from 'rt-testing'
import { ServiceStub } from 'rt-system'
import { of } from 'rxjs'
import { ISubscription } from 'autobahn'

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
        const request$ = stub.requestResponse<string, string>(procedure, payload, replyTo)
        expectObservable(request$).toBe(expected)
      })
    })

    it('returns a result via an observable that completes after a getting a result', () => {
      new MockScheduler().run(({ cold, expectObservable }) => {
        const variables = { c: createMockConnection(new MockSession()), r: requestReplyResult }

        //emit connection event after two frames
        const connection$ = cold<ConnectionEvent>('--c', variables)
        const stub = new ServiceStub(Username, connection$)
        const expected = '--(r|)'
        const request$ = stub.requestResponse<string, string>(procedure, payload, replyTo)
        expectObservable(request$).toBe(expected, variables)
      })
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
      const stub = new ServiceStub(Username, of(createMockConnection()))
      stub.subscribeToTopic(topic).subscribe()
      expect(SubscribeMock.mock.calls[0][0]).toBe(topic)
    })

    it('allows observation of Autobahn acknowlegement', () => {
      const stub = new ServiceStub(Username, of(createMockConnection()))
      const mockNextObserver = {
        next: jest.fn(),
      }
      stub
        .subscribeToTopic(topic, mockNextObserver)
        .subscribe()
        .unsubscribe()
      expect(mockNextObserver.next).toHaveBeenCalled()
    })

    it('streams topic results', () => {
      new MockScheduler().run(({ cold, expectObservable }) => {
        const connection$ = cold<ConnectionEvent>('--c', variables)
        const stub = new ServiceStub(Username, connection$)
        const expected = '--(123)'
        const topicSubscription$ = stub.subscribeToTopic(topic)
        expectObservable(topicSubscription$).toBe(expected, variables)
      })
    })

    it('Unsubsribes to the autobahn session on dispose', () => {
      new MockScheduler().run(({ cold, expectObservable, flush }) => {
        const connection$ = cold<ConnectionEvent>('c', variables)
        const stub = new ServiceStub(Username, connection$)
        const topicSubscription$ = stub.subscribeToTopic(topic)
        expectObservable(topicSubscription$, '---!')
        flush()
        expect(UnsubscribeMock).toHaveBeenCalled()
      })
    })

    it('Observable topic errors when an acknowledgement fails', () => {
      new MockScheduler().run(({ cold, expectObservable }) => {
        const connection$ = cold<ConnectionEvent>('--c', variables)
        const stub = new ServiceStub(Username, connection$)
        const topicSubscription$ = stub.subscribeToTopic(FAILURE_TOPIC)
        expectObservable(topicSubscription$).toBe('--#', variables, topicError)
      })
    })
  })
})

const createMockConnection: (session?: AutobahnSessionProxy) => ConnectionOpenEvent = (
  session: AutobahnSessionProxy = new MockSession(),
) => ({
  type: ConnectionEventType.CONNECTED,
  session,
  url: 'FAKE',
  transportType: 'longpoll',
})

const FAILURE_TOPIC = 'FAILURE_TOPIC'
const topicError = new Error('failure')
const topicResults = ['result1', 'result2', 'result3']

const SubscribeMock = jest.fn((topic: string, responseCB: (response: string[]) => void) => {
  if (topic !== FAILURE_TOPIC) {
    topicResults.forEach(result => responseCB([result]))
  }
  return {
    then: (cb: (result: ISubscription) => void, err: (error: Error) => void) => {
      if (topic === FAILURE_TOPIC) {
        err(topicError)
      } else {
        cb(new SubscriptionMock())
      }
    },
  }
})

const requestReplyResult = 'result'

const CallMock = jest.fn().mockReturnValue({
  then: (cb: (result: string) => {}) => cb(requestReplyResult),
})

const UnsubscribeMock = jest.fn().mockReturnValue({
  then: (cb: () => {}) => cb(),
})

const SubscriptionMock = jest.fn<ISubscription>()

const MockSession = jest.fn<AutobahnSessionProxy>(() => {
  return {
    isOpen: jest.fn().mockReturnValue(true),
    subscribe: SubscribeMock,
    unsubscribe: UnsubscribeMock,
    call: CallMock,
  }
})
