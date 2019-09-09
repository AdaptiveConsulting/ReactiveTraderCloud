
// Wait for an object to apear on the window object. Useful for Openfin, Finsemble and Glue
export function waitForObject<T>(objectName: string, intervalTime = 400): Promise<T> {
    return new Promise<T>(resolve => {
      const interval = setInterval(() => {
        if (window[objectName]) {
          clearTimeout(interval)
          resolve(window[objectName])
        }
      }, intervalTime)
    })
  }
  