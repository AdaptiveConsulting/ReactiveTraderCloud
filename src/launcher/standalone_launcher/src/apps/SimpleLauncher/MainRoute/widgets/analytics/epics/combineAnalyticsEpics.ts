import { combineEpics } from 'redux-observable'
import { analyticsServiceEpic } from './epics'
import { ApplicationDependencies } from 'apps/SimpleLauncher/MainRoute/store/applicationServices'
import { publishPositionToExcelEpic } from './analyticsServiceEpic'

const combine = ({ platform }: ApplicationDependencies) => {
  const epics = [analyticsServiceEpic, publishPositionToExcelEpic]

  return combineEpics(...epics)
}

export default combine
