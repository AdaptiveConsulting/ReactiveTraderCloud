import { combineEpics } from 'redux-observable'
import { publishBlotterToExcelEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'
import { connectBlotterToNotifications, requestBrowserNotificationPermission } from './blotterServiceEpic'
import { ApplicationDependencies } from 'apps/MainRoute/store/applicationServices'
import { blotterHighlightEpic } from './blotterHighlightEpic'

export default ({ platform }: ApplicationDependencies) => {
  const epics = [blotterServiceEpic, connectBlotterToNotifications, requestBrowserNotificationPermission]

  if (platform.hasFeature('excel')) {
    epics.push(publishBlotterToExcelEpic)
  }

  if (platform.hasFeature('notificationHighlight')) {
    epics.push(blotterHighlightEpic)
  }

  return combineEpics(...epics)
}
