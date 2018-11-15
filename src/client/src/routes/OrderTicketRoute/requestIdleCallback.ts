declare global {
  interface Window {
    requestIdleCallback: (cb: () => {}) => void
    cancelIdleCallback: (cb: () => {}) => void
  }
}

// tslint:disable
const __requestIdleCallback = function(callback: Function) {
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

const __cancelIdleCallback = function(id: number) {
  clearTimeout(id)
}

const isSupported = typeof window.requestIdleCallback !== 'undefined'

const requestIdleCallback = isSupported ? window.requestIdleCallback : __requestIdleCallback
const cancelIdleCallback = isSupported ? window.cancelIdleCallback : __cancelIdleCallback

export default requestIdleCallback
export { requestIdleCallback, cancelIdleCallback }
