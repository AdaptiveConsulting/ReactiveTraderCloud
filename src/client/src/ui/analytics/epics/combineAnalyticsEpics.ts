import { combineEpics } from 'redux-observable'
import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { analyticsServiceEpic } from './epics'
import { ApplicationDependencies } from 'applicationServices'

export default ({ platform }: ApplicationDependencies) => {
  const interopServices = platform.interopServices
  const epics = [analyticsServiceEpic]

  if (interopServices.excel) {
    epics.push(publishPositionUpdateEpic)
  }

  return combineEpics(...epics)
}
