/**
 * Returns a promise that resolves after a given time with a given value
 */
export function wait<T>(time: number, value: T) {
  return new Promise<T>(res => {
    setTimeout(() => res(value), time)
  })
}

/**
 * Returns a tuple with a new promise and its resolve/reject callbacks to invoke directly
 */
export function getDeferredPromise<T>(): [Promise<T>, (value?: T) => void, (reason?: any) => void] {
  let res: (value?: T) => void
  let rej: (reason?: any) => void
  const p = new Promise<T>((r, rj) => {
    res = r
    rej = rj
  })
  return [p, res as (value?: T) => void, rej]
}
