import { combineEpics } from 'redux-observable'
import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { analyticsServiceEpic } from './epics'
import { ApplicationDependencies } from 'applicationServices'

export default ({ platform }: ApplicationDependencies) => {
  const epics = [analyticsServiceEpic]

  if (platform.hasFeature('excel')) {
    epics.push(publishPositionUpdateEpic)
  }

  return combineEpics(...epics)
}
