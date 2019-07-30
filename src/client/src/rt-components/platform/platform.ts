import { Browser, Finsemble, OpenFin, PlatformAdapter, Glue42 } from './adapters'

const isFinsemble = 'FSBL' in window
const isOpenFin = typeof fin !== 'undefined'
const isGlue = 'glue42gd' in window

const getPlatform: () => PlatformAdapter = () => {
  if (isFinsemble) {
    console.info('Using Finsemble API')
    return new Finsemble()
  }
  if (isOpenFin) {
    console.info('Using OpenFin API')
    return new OpenFin()
  }
  if (isGlue) {
    console.info('Using Glue API')
    return new Glue42()
  }
  console.info('Using Browser API')
  return new Browser()
}

const platform = getPlatform()
export default platform
