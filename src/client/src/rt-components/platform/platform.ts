import { Browser, Finsemble, OpenFin, PlatformAdapter, Symphony } from './adapters'

const isFinsemble = 'FSBL' in window
const isOpenFin = 'fin' in window
const isSymphony = 'SYMPHONY' in window

const getPlatform: () => PlatformAdapter = () => {
  if (isFinsemble) {
    console.info('Using Finsemble API')
    return new Finsemble()
  }
  if (isOpenFin) {
    console.info('Using OpenFin API')
    return new OpenFin()
  }

  if (isSymphony) {
    console.info('Using Symphony')
    return new Symphony()
  }

  console.info('Using Browser API')
  return new Browser()
}

const platform = getPlatform()
export default platform
