declare const window: any

const _requestIdleCallback = function(callback: Function, options: Object) {
  return setTimeout(() => {
    const start = Date.now()
    callback({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start))
      },
    })
  }, 1)
}

const _cancelIdleCallback = function(id: number) {
  clearTimeout(id)
}

const isSupported = typeof window.requestIdleCallback !== 'undefined'

const requestIdleCallback = isSupported ? window.requestIdleCallback : _requestIdleCallback
const cancelIdleCallback = isSupported ? window.cancelIdleCallback : _cancelIdleCallback

export default requestIdleCallback
export { requestIdleCallback, cancelIdleCallback }
