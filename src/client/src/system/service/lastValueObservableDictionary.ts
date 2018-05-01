import LastValueObservable from './lastValueObservable'

export default class LastValueObservableDictionary<T> {
  private version: number
  private readonly values: { [key: string]: LastValueObservable<T> }

  constructor() {
    this.values = {}
    this.version = 0
  }

  hasKey(key: string) {
    return this.values.hasOwnProperty(key)
  }

  add(key: string, value: LastValueObservable<T>) {
    this.values[key] = value
    this.version++
  }

  getValues() {
    return Object.values(this.values)
  }

  updateWithLatestValue(key: string, latestValue: T) {
    this.values[key].latestValue = latestValue
    this.version++
  }
}
