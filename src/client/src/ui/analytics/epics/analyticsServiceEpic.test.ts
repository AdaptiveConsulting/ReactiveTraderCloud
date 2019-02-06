import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { TestScheduler } from 'rxjs/testing'
import { map } from 'rxjs/operators'
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable'

describe('publishPositionUpdateEpic', () => {
  it('foo test', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      console.log(actual, expected)
      expect(actual).toEqual(expected)
    })
    testScheduler.run(({ cold, expectObservable }) => {
      const source$: ColdObservable<number> = cold('--a--b|', { a: 5, b: 10 })
      const expectedMarble = '--x--y|'
      const expectedValue = { x: 10, y: 20 }
      const result$ = source$.pipe(map(x => x * 2))
      expectObservable(result$).toBe(expectedMarble, expectedValue)
    })
  })
})
