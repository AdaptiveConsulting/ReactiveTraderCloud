import { Browser, Finsemble, OpenFin } from './adapters'

const isFinsemble = typeof window.FSBL !== 'undefined'
const isOpenFin = typeof fin !== 'undefined'

const getPlatform = () => {
  if (isFinsemble) {
    console.info('Using Finsemble API')
    return Finsemble
  }
  if (isOpenFin) {
    console.info('Using OpenFin API')
    return OpenFin
  }
  console.info('Using Browser API')
  return Browser
}

const Platform = getPlatform()

export default Platform
