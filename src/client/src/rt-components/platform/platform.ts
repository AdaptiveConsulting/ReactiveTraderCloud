import Browser from './browser/browser'
import OpenFin from './openfin/openFin'

const isOpenFin = typeof fin !== 'undefined'

const getPlatform = () => {
  if (isOpenFin) {
    console.log('Using OpenFin API')
    return OpenFin
  }
  console.log('Using Browser API')
  return Browser
}

export default getPlatform()
