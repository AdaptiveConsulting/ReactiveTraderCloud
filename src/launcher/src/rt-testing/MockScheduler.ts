import { TestScheduler } from 'rxjs/testing'
export class MockScheduler extends TestScheduler {
  constructor() {
    super((actual, expected) => expect(actual).toMatchObject(expected))
  }
}
