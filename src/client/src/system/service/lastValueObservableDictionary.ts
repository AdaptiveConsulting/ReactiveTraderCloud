import LastValueObservable from './lastValueObservable'

export default class LastValueObservableDictionary {
  version: number
  values: {}

  constructor() {
    this.values = {}
    this.version = 0
  }

  hasKey(key: string) {
    return this.values.hasOwnProperty(key)
  }

  add(key: string, value: LastValueObservable<any>) {
    this.values[key] = value
    this.version++
  }

  updateWithLatestValue(key: string, latestValue: Object) {
    this.values[key].latestValue = latestValue
    this.version++
  }
}
