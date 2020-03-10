// @ts-ignore
import { OpenFinFDC3, FDC3 } from '../fdc3'

const isFinsemble = 'FSBL' in window
const isOpenFin = 'fin' in window && !isFinsemble

export const getProvider = () => {
  if (isOpenFin) {
    // @ts-ignore
    const openFinFDC3 = new OpenFinFDC3()
    return new FDC3(openFinFDC3)
  }

  return null
}
