import { Browser, OpenFin } from './adapters'

const isOpenFin = typeof fin !== 'undefined'

const getPlatform = () => {
  if (isOpenFin) {
    console.log('Using OpenFin API')
    return OpenFin
  }
  console.log('Using Browser API')
  return Browser
}

const Platform = getPlatform()

export default new Platform()
