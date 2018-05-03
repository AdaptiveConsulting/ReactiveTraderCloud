import BrowserPopoutService from './browserPopoutService'
import OpenfinPopoutService from './openfinPopoutService'

let popoutService = null

export default function getPopoutService(openfin) {
  if (popoutService === null) {
    popoutService =
      openfin && openfin.isRunningInOpenFin
        ? new OpenfinPopoutService(openfin)
        : new BrowserPopoutService()
  }
  return popoutService
}
