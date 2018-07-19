import { combineEpics } from 'redux-observable'
import { connectBlotterServiceToOpenFinEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'

const epics = [blotterServiceEpic]
if (typeof fin !== 'undefined') {
  epics.push(connectBlotterServiceToOpenFinEpic)
}

export default combineEpics(...epics)
