import { serviceStatusStream$, RawServiceStatus } from 'rt-system'
import { MockScheduler } from 'rt-testing'
import { map } from 'rxjs/operators'

const MockRawServiceStatus = (overrides: Partial<RawServiceStatus>): RawServiceStatus => ({
  Type: 'Analytics',
  Instance: 'b356',
  TimeStamp: 4500,
  Load: 4,
  ...overrides,
})

describe('ServiceStatusStream', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show which services are currently running and what their loads are', () => {
    new MockScheduler().run(({ cold, expectObservable }) => {
      const rawStatusService = MockRawServiceStatus({})

      const source$ = cold<RawServiceStatus>('a', { a: rawStatusService })

      const serviceStatus$ = serviceStatusStream$(source$, 3000).pipe(
        map(x => x.getServiceInstanceStatus('Analytics', 'b356')!.serviceLoad),
      )

      expectObservable(serviceStatus$, '--!').toBe('r', { r: 4 })
    })
  })

  it('should mark a service as disconnected if an update has not been received for 4 secs', () => {
    new MockScheduler().run(({ cold, expectObservable }) => {
      const connectedServiceUpdate = MockRawServiceStatus({ Type: 'Analytics', Instance: 'Analytics01' })

      const source$ = cold<RawServiceStatus>('a 4s ', { a: connectedServiceUpdate })

      const serviceStatus$ = serviceStatusStream$(source$, 4001).pipe(
        map(x => x.getServiceInstanceStatus('Analytics', 'Analytics01')!.isConnected),
      )

      expectObservable(serviceStatus$).toBe('c 4s e', { c: true, e: false })
    })
  })

  it('should mark a disconnected service as connected after receiving an update', () => {
    new MockScheduler().run(({ cold, expectObservable }) => {
      const connectedServiceUpdate = MockRawServiceStatus({ Type: 'Analytics', Instance: 'Analytics01' })
      const source$ = cold<RawServiceStatus>('a 100ms a', { a: connectedServiceUpdate })

      const serviceStatus$ = serviceStatusStream$(source$, 100).pipe(
        map(x => x.getServiceInstanceStatus('Analytics', 'Analytics01')!.isConnected),
      )

      expectObservable(serviceStatus$).toBe('c 99ms ec 99ms e', { c: true, e: false })
    })
  })
})
