declare global {
  interface Window {
    requestIdleCallback: (cb: Function) => void
    cancelIdleCallback: (cb: Function) => void
  }
}

const requestIdleCallbackPolyfill = (callback: Function) =>
  setTimeout(() => {
    const start = Date.now()

    callback({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start))
      },
    })
  }, 1)

const cancelIdleCallbackPolyfill = (id: number) => {
  clearTimeout(id)
}

const isSupported = typeof window.requestIdleCallback !== 'undefined'

const requestIdleCallback = isSupported ? window.requestIdleCallback : requestIdleCallbackPolyfill
const cancelIdleCallback = isSupported ? window.cancelIdleCallback : cancelIdleCallbackPolyfill

export default requestIdleCallback
export { requestIdleCallback, cancelIdleCallback }
