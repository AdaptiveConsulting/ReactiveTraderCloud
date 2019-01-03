import { combineEpics } from 'redux-observable'
import { connectBlotterToNotifications } from './blotterServiceEpic'
import { publishBlotterEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'

const epics = [blotterServiceEpic, connectBlotterToNotifications]
if (typeof window.FSBL === 'undefined' && typeof fin !== 'undefined') {
  epics.push(publishBlotterEpic)
}

export default combineEpics(...epics)
