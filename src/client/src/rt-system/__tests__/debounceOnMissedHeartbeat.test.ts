import { debounceWithSelector } from 'rt-system'
import { TestScheduler } from 'rxjs/testing'

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected)
})

describe('debounceWithSelector', () => {
  it('should let source observable values pass through as long as the values are emitted within due time ', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const dueTime = 4
      const source$ = cold<number>('--a-a|', { a: 10 })
      const expected = '--b-b---(c|)'
      const obs = debounceWithSelector(dueTime, (x: number) => x + 5)(source$)

      expectObservable(obs).toBe(expected, { b: 10, c: 15 })
    })
  })

  it('should emit the value of the item selector if there is no value emitted from the source observable within due time', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const dueTime = 3
      const source$ = cold<number>('--a---a|', { a: 10 })
      const expected = '----------b--cb--(c|)'
      const obs = debounceWithSelector(dueTime, (x: number) => x + 5)(source$)

      expectObservable(obs).toBe(expected, { b: 10, c: 15 })
    })
  })
})
