import { combineEpics } from 'redux-observable'
import { publishPositionUpdateEpic } from './analyticsServiceEpic'
import { analyticsServiceEpic } from './epics'

const epics = [analyticsServiceEpic]

if (typeof fin !== 'undefined') {
  epics.push(publishPositionUpdateEpic)
}

export default combineEpics(...epics)
