import { Browser, Finsemble, OpenFin } from './adapters'
import { PlatformAdapter } from 'rt-components';

const isFinsemble = typeof window.FSBL !== 'undefined'
const isOpenFin = typeof fin !== 'undefined'

const getPlatform:() => PlatformAdapter = () => {
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
export default platform
