import { BasePlatformAdapter } from './platformAdapter'

const isFinsemble = 'FSBL' in window
const isOpenFin = 'fin' in window
const isSymphony = 'SYMPHONY' in window

type PlatformAdapter = BasePlatformAdapter

function* platformResolver(func: Function) {
  yield func()
}

const getPlatform: () => PlatformAdapter = () => {
  if (isFinsemble) {
    console.info('Using Finsemble API')
    const gen = platformResolver(() => import('./finsemble'))
    const FinsembleModule = gen.next().value
    const Finsemble = FinsembleModule.default
    return new Finsemble()
  }
  if (isOpenFin) {
    console.info('Using OpenFin API')
    const gen = platformResolver(() => import('./openFin'))
    const OpenFinModule = gen.next().value
    const OpenFin = OpenFinModule
    return new OpenFin()
  }

  if (isSymphony) {
    console.info('Using Symphony')
    const gen = platformResolver(() => import('./symphony'))
    const SymphonyModule = gen.next().value
    const Symphony = SymphonyModule
    return new Symphony()
  }

  console.info('Using Browser API')
  const gen = platformResolver(() => import('./browser'))
  const BrowserModule = gen.next().value
  const Browser = BrowserModule
  return new Browser()
}

const platform = getPlatform()
export default platform
