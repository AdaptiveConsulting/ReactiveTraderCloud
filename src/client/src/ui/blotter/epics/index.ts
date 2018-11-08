import { combineEpics } from 'redux-observable'
import { publishBlotterEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'

const epics = [blotterServiceEpic]
if (typeof fin !== 'undefined') {
  epics.push(publishBlotterEpic)
}

export default combineEpics(...epics)
