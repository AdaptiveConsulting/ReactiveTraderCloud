import { combineEpics } from 'redux-observable'
import { publishBlotterEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'
import { connectBlotterToNotifications, requestBrowserNotificationPermission } from './blotterServiceEpic'
import { blotterHighlightEpic } from './blotterHighlightEpic'

const epics = [blotterServiceEpic, connectBlotterToNotifications, requestBrowserNotificationPermission]
if (typeof fin !== 'undefined') {
  epics.push(publishBlotterEpic, blotterHighlightEpic)
}

export default combineEpics(...epics)
