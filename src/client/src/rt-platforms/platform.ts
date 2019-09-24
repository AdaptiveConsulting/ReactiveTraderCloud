import { Browser, Finsemble, OpenFin, PlatformAdapter, Symphony } from './'
import { waitForObject } from '../rt-util'

const urlParams = new URLSearchParams(window.location.search)

const isFinsemble = 'FSBL' in window
const isOpenFin = 'fin' in window
const isSymphony = urlParams.has('waitFor') && urlParams.get('waitFor') === 'SYMPHONY'

const getPlatform: () => PlatformAdapter = () => {
  if (isSymphony) {
    console.info('Using Symphony')
    return new Symphony()
  }

  if (isFinsemble) {
    console.info('Using Finsemble API')
    return new Finsemble()
  }
  if (isOpenFin) {
    console.info('Using OpenFin API')
    return new OpenFin()
  }

  console.info('Using Browser API')
  return new Browser()
}

const getPlatformAsync = async () => {
  if (isSymphony) {
    await waitForObject(urlParams.get('waitFor'))
    return new Symphony()
  }

  if (isFinsemble) {
    console.info('Using Finsemble API')
    return new Finsemble()
  }
  if (isOpenFin) {
    console.info('Using OpenFin API')
    return new OpenFin()
  }

  console.info('Using Browser API')
  return new Browser()
}

const platform = getPlatform()
export { getPlatform, getPlatformAsync }
export default platform
