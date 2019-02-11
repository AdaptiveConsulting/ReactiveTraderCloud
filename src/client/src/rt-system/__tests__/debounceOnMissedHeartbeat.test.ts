import { debounceWithSelector } from 'rt-system'
import { TestScheduler } from 'rxjs/testing'

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected)
})

describe('debounceWithSelector', () => {
  it('should emit source observable values if values emitted from source are within the due time', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const dueTime = 4
      const source$ = cold<number>('--a-a|', { a: 10 })
      const expected = '--b-b---(c|)'
      const obs = debounceWithSelector(dueTime, (x: number) => x + 5)(source$)

      expectObservable(obs).toBe(expected, { b: 10, c: 15 })
    })
  })

  it('should emit another value if source source observable does emit value within specified timeframe', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const dueTime = 3
      const source$ = cold<number>('--a---a|', { a: 10 })
      const expected = '----------b--cb--(c|)'
      const obs = debounceWithSelector(dueTime, (x: number) => x + 5)(source$)

      expectObservable(obs).toBe(expected, { b: 10, c: 15 })
    })
  })
})
