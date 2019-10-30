import { combineEpics } from 'redux-observable'
import { analyticsServiceEpic } from './epics'
import { ApplicationDependencies } from 'apps/MainRoute/store/applicationServices'
import { publishPositionToExcelEpic } from './analyticsServiceEpic'

export default ({ platform }: ApplicationDependencies) => {
  const epics = [analyticsServiceEpic, publishPositionToExcelEpic]

  return combineEpics(...epics)
}
