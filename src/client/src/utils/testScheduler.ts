import { TestScheduler } from "rxjs/testing"
export const testScheduler = () =>
  new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected)
  })
