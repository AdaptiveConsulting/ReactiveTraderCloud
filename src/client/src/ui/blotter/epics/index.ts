import { combineEpics } from 'redux-observable'
import { publishBlotterEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'
import { connectBlotterToNotifications } from './blotterServiceEpic'

const epics = [blotterServiceEpic]
if (typeof fin !== 'undefined') {
  epics.push(publishBlotterEpic, connectBlotterToNotifications)
}

export default combineEpics(...epics)
