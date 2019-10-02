import { Browser, Finsemble, OpenFin, Symphony } from './'

const urlParams = new URLSearchParams(window.location.search)

const isFinsemble = 'FSBL' in window
const isOpenFin = 'fin' in window
const isSymphony = urlParams.has('waitFor') && urlParams.get('waitFor') === 'SYMPHONY'

export const getPlatformAsync = async () => {
  if (isSymphony) {
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
