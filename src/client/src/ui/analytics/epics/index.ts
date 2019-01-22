import { combineEpics } from 'redux-observable'
import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { analyticsServiceEpic } from './epics'

export default ({ platform }: any) => {
  const { interopServices } = platform
  const epics = [analyticsServiceEpic]

  if (interopServices.excel) {
    epics.push(publishPositionUpdateEpic)
  }

  return combineEpics(...epics)
}
