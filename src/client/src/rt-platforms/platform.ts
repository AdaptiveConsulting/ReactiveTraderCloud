import { BasePlatformAdapter } from './platformAdapter'

const isFinsemble = 'FSBL' in window
const isOpenFin = 'fin' in window
const isSymphony = 'SYMPHONY' in window

type PlatformAdapter = BasePlatformAdapter
export type PlatformWrapper = {
  platform: PlatformAdapter
}

const getPlatform: () => Promise<PlatformAdapter> = async () => {
  if (isFinsemble) {
    console.info('Using Finsemble API')
    const FinsembleModule = await import('./finsemble')
    const Finsemble = FinsembleModule.default
    return new Finsemble()
  }
  if (isOpenFin) {
    console.info('Using OpenFin API')
    const OpenFinModule = await import('./openFin')
    const OpenFin = OpenFinModule.OpenFin
    return new OpenFin()
  }

  if (isSymphony) {
    console.info('Using Symphony')
    const SymphonyModule = await import('./symphony')
    const Symphony = SymphonyModule.Symphony
    return new Symphony()
  }

  console.info('Using Browser API')
  const BrowserModule = await import('./browser')
  const Browser = BrowserModule.Browser
  return new Browser()
}

let platform: PlatformWrapper = {
  platform: null,
}

export const loadPlatform = () =>
  getPlatform().then(result => {
    platform.platform = result
  })

export default () => platform.platform
