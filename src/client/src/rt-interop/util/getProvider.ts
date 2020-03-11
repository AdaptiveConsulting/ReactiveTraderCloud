const isFinsemble = 'FSBL' in window
const isOpenFin = 'fin' in window && !isFinsemble

export const getProvider = () => {
  if (isOpenFin) {
    // @ts-ignore
    const { OpenFinFDC3, FDC3 } = require('../fdc3')
    console.log(OpenFinFDC3)
    const openFinFDC3 = new OpenFinFDC3()

    return new FDC3(openFinFDC3)
  }

  return null
}
