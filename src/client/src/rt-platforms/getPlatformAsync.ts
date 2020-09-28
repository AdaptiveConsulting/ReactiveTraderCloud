interface Navigator {
  standalone?: boolean
}

const urlParams = new URLSearchParams(window.location.search)

const isFinsemble = 'FSBL' in window
// TODO: We should not need to negate `isFinsemble` to check for OpenFin.
// Somewhere, `fin` is being added to the `window` object even in electron/finsemble versions.
const isOpenFin = 'fin' in window && !isFinsemble
const isGlue42 = 'glue42gd' in window
const isSymphony = urlParams.has('waitFor') && urlParams.get('waitFor') === 'SYMPHONY'
const isGlueCore = urlParams.has('glue') && urlParams.get('glue') === 'CORE'
const isPWA = () =>
  (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
  (window.navigator as Navigator).standalone

export const getSymphonyPlatform = () => import(/* webpackChunkName: "symphony" */ './symphony')

export const getFinsemblePlatform = () => import(/* webpackChunkName: "finsemble" */ './finsemble')

export const getOpenFin = () => import(/* webpackChunkName: "openfin" */ './openFin')

export const getOpenFinPlatform = () =>
  import(/* webpackChunkName: "openfin-platform" */ './openfin-platform')

export const getGlue42Platform = () => import(/* webpackChunkName: "glue" */ './glue')

export const getBrowserPlatform = () => import(/* webpackChunkName: "browser" */ './browser')

export const getGlue42CorePlatform = () => import(/* webpackChunkName: "browser" */ './glue')

export const getPWAPlatform = () => import(/* webpackChunkName: "browser" */ './pwa')

export const getPlatformAsync = async () => {
  if (isGlueCore) {
    const { Glue42Core } = await getGlue42CorePlatform()
    return new Glue42Core()
  }

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
    let appInfo = await window.fin.Application.getCurrentSync().getInfo()

    if (appInfo.initialOptions.isPlatformController) {
      console.info('Using OpenFin Platform API')
      const { OpenFinPlatform } = await getOpenFinPlatform()
      return new OpenFinPlatform()
    }

    console.info('Using OpenFin Legacy API')
    const { OpenFin } = await getOpenFin()
    return new OpenFin()
  }

  if (isGlue42) {
    console.info('Using Glue42 API')
    const { Glue42 } = await getGlue42Platform()
    return new Glue42()
  }

  if (isPWA()) {
    console.info('Using PWA API')
    const { PWA } = await getPWAPlatform()
    return new PWA()
  }

  console.info('Using Browser API')
  const { Browser } = await getBrowserPlatform()
  return new Browser()
}
