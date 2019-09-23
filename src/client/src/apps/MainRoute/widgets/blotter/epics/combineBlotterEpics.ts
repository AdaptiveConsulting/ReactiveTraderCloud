import { combineEpics } from 'redux-observable'
import { blotterServiceEpic } from './epics'
import {
  connectBlotterToNotifications,
  publishBlotterToExcelEpic,
  requestBrowserNotificationPermission,
} from './blotterServiceEpic'
import { ApplicationDependencies } from 'apps/MainRoute/store/applicationServices'
import { blotterHighlightEpic } from './blotterHighlightEpic'

export default ({ platform }: ApplicationDependencies) => {
  const epics = [
    blotterServiceEpic,
    connectBlotterToNotifications,
    requestBrowserNotificationPermission,
    publishBlotterToExcelEpic,
  ]

  if (platform.hasFeature('interop')) {
    epics.push(blotterHighlightEpic)
  }

  return combineEpics(...epics)
}
