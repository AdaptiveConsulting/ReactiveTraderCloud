const isFinsemble = 'FSBL' in window
// TODO: We should not need to negate `isFinsemble` to check for OpenFin.
// Somewhere, `fin` is being added to the `window` object even in electron/finsemble versions.
const isOpenFin = 'fin' in window && !isFinsemble

export const getProvider = () => {
  if (isOpenFin) {
    // @ts-ignore
    const { OpenFinFDC3, FDC3 } = require('../fdc3')
    const openFinFDC3 = new OpenFinFDC3()

    return new FDC3(openFinFDC3)
  }

  return null
}
