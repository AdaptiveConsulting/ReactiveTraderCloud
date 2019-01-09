import { combineEpics } from 'redux-observable'
import { publishBlotterEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'
import { connectBlotterToNotifications, requestBrowserNotificationPermission } from './blotterServiceEpic'

const epics = [blotterServiceEpic, connectBlotterToNotifications, requestBrowserNotificationPermission]
if (typeof fin !== 'undefined') {
  epics.push(publishBlotterEpic)
}

export default combineEpics(...epics)
