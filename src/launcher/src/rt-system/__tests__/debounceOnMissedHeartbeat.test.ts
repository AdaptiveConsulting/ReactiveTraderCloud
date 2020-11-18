import { debounceWithSelector } from 'rt-system'
import { TestScheduler } from 'rxjs/testing'
import { ServiceStatus } from 'rt-types/serviceStatus'
import { ServiceConnectionStatus } from 'rt-types'

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected)
})

describe('debounceWithSelector', () => {
  const connected: ServiceStatus = {
    connectedInstanceCount: 1,
    connectionStatus: ServiceConnectionStatus.CONNECTED,
    serviceType: 'service1'
  }
  const disconnected: ServiceStatus = {
    connectedInstanceCount: 1,
    connectionStatus: ServiceConnectionStatus.DISCONNECTED,
    serviceType: 'service1'
  }
  const values = {
    c: connected,
    d: disconnected
  }

  it('should let source observable values pass through as long as the values are emitted within due time ', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const dueTime = 4
      const source = '  --c-c|'
      const expected = '--c-c---(d|)'
      const source$ = cold<ServiceStatus>(source, values)
      const obs = source$.pipe(
        debounceWithSelector(dueTime, status => ({
          ...status,
          connectionStatus: ServiceConnectionStatus.DISCONNECTED
        }))
      )
      expectObservable(obs).toBe(expected, values)
    })
  })

  it('should emit the value of the item selector if there is no value emitted from the source observable within due time', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const dueTime = 3
      const source = '  --c---c|'
      const expected = '----------c--dc--(d|)'
      const source$ = cold<ServiceStatus>(source, values)
      const obs = source$.pipe(
        debounceWithSelector(dueTime, status => ({
          ...status,
          connectionStatus: ServiceConnectionStatus.DISCONNECTED
        }))
      )
      expectObservable(obs).toBe(expected, values)
    })
  })
})
