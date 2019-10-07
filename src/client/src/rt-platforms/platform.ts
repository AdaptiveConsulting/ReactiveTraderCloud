import { Browser, Finsemble, OpenFin, PlatformAdapter, Symphony, Glue42 } from './'

const urlParams = new URLSearchParams(window.location.search)

const isFinsemble = 'FSBL' in window
const isOpenFin = 'fin' in window
const isGlue42 = 'glue42gd' in window
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

  if (isGlue42) {
    console.log('Using Glue42 API')
    return new Glue42()
  }

  console.info('Using Browser API')
  return new Browser()
}

const platform = getPlatform()
export default platform
