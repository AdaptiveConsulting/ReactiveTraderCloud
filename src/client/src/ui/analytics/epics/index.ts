import { combineEpics } from 'redux-observable'
import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { analyticsServiceEpic } from './epics'
import { InteropServices, PlatformAdapter } from 'rt-components'

export default ({ platform }: { platform: PlatformAdapter }) => {
  const { interopServices }: { interopServices: InteropServices } = platform
  const epics = [analyticsServiceEpic]

  if (interopServices.excel) {
    epics.push(publishPositionUpdateEpic)
  }

  return combineEpics(...epics)
}
