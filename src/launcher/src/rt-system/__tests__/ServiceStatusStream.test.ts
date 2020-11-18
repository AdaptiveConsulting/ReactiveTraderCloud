import { serviceStatusStream$, RawServiceStatus } from 'rt-system'
import { MockScheduler } from 'rt-testing'
import { map } from 'rxjs/operators'
import { ServiceConnectionStatus } from 'rt-types'

const mockRawServiceStatus = (overrides: Partial<RawServiceStatus> = {}): RawServiceStatus => ({
  Type: 'Analytics',
  Instance: 'b356',
  TimeStamp: 4500,
  Load: 4,
  ...overrides
})

describe('ServiceStatusStream', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show which services are currently running', () => {
    new MockScheduler().run(({ cold, expectObservable }) => {
      const variables = {
        1: mockRawServiceStatus({ Type: 'Blotter', Instance: 'blotter1' }),
        2: mockRawServiceStatus({ Type: 'Blotter', Instance: 'blotter2' }),
        3: mockRawServiceStatus({ Type: 'Blotter', Instance: 'blotter3' })
      }

      const input = '123'
      const source$ = cold<RawServiceStatus>(input, variables)
      const expected = 'abc'

      const serviceStatus$ = serviceStatusStream$(source$, 3000).pipe(
        map(serviceStatus => serviceStatus.getStatusOfServices()['Blotter'].connectedInstanceCount)
      )
      expectObservable(serviceStatus$, '---!').toBe(expected, { a: 1, b: 2, c: 3 })
    })
  })

  it('should mark a service as disconnected if an update has not been received for 3 secs', () => {
    new MockScheduler().run(({ cold, expectObservable }) => {
      const serviceType = 'Analytics'
      const instanceName = 'Analytics01'
      const connectedServiceUpdate = mockRawServiceStatus({
        Type: serviceType,
        Instance: instanceName
      })

      const HEART_BEAT_TIME = 3000
      const input = `a ${HEART_BEAT_TIME}ms `
      const source$ = cold<RawServiceStatus>(input, { a: connectedServiceUpdate })
      const expected = `c ${HEART_BEAT_TIME - 1}ms e`

      const serviceStatus$ = serviceStatusStream$(source$, HEART_BEAT_TIME).pipe(
        map(x => x.getStatusOfServices()[serviceType].connectionStatus)
      )
      expectObservable(serviceStatus$).toBe(expected, {
        c: ServiceConnectionStatus.CONNECTED,
        e: ServiceConnectionStatus.DISCONNECTED
      })
    })
  })

  it('should mark a disconnected service as connected after receiving an update', () => {
    new MockScheduler().run(({ cold, expectObservable }) => {
      const serviceType = 'Analytics'
      const instanceName = 'Analytics01'
      const connectedServiceUpdate = mockRawServiceStatus({
        Type: serviceType,
        Instance: instanceName
      })
      const HEART_BEAT_TIME = 100

      const input = `a ${HEART_BEAT_TIME}ms a`
      const expected = `c ${HEART_BEAT_TIME - 1}ms ec ${HEART_BEAT_TIME - 1}ms e`

      const source$ = cold<RawServiceStatus>(input, { a: connectedServiceUpdate })
      const serviceStatus$ = serviceStatusStream$(source$, 100).pipe(
        map(x => x.getStatusOfServices()[serviceType].connectionStatus)
      )
      expectObservable(serviceStatus$).toBe(expected, {
        c: ServiceConnectionStatus.CONNECTED,
        e: ServiceConnectionStatus.DISCONNECTED
      })
    })
  })
})
