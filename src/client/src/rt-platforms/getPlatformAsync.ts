const urlParams = new URLSearchParams(window.location.search)

const isFinsemble = 'FSBL' in window
const isOpenFin = 'fin' in window
const isGlue42 = 'glue42gd' in window
const isSymphony = urlParams.has('waitFor') && urlParams.get('waitFor') === 'SYMPHONY'

export const getSymphonyPlatform = () => import(/* webpackChunkName: "symphony" */ './symphony')

export const getFinsemblePlatform = () => import(/* webpackChunkName: "finsemble" */ './finsemble')

export const getOpenFinPlatform = () => import(/* webpackChunkName: "openfin" */ './openFin')

export const getGlue42Platform = () => import(/* webpackChunkName: "glue" */ './glue')

export const getBrowserPlatform = () => import(/* webpackChunkName: "browser" */ './browser')

export const getPlatformAsync = async () => {
  if (isSymphony) {
    const { Symphony } = await getSymphonyPlatform()
    return new Symphony()
  }

  if (isFinsemble) {
    console.info('Using Finsemble API')
    const { Finsemble } = await getFinsemblePlatform()
    return new Finsemble()
  }

  if (isOpenFin) {
    console.info('Using OpenFin API')
    const { OpenFin } = await getOpenFinPlatform()
    return new OpenFin()
  }

  if (isGlue42) {
    console.info('Using Glue42 API')
    const { Glue42 } = await getGlue42Platform()
    return new Glue42()
  }

  console.info('Using Browser API')
  const { Browser } = await getBrowserPlatform()
  return new Browser()
}
