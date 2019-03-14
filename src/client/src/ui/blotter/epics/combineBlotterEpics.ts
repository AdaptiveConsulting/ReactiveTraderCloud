import { combineEpics } from 'redux-observable'
import { publishBlotterToExcelEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'
import { connectBlotterToNotifications, requestBrowserNotificationPermission } from './blotterServiceEpic'
import { ApplicationDependencies } from 'applicationServices'
import { blotterHighlightEpic } from './blotterHighlightEpic'

export default ({ platform }: ApplicationDependencies) => {
  const interopServices = platform.interopServices
  const epics = [blotterServiceEpic, connectBlotterToNotifications, requestBrowserNotificationPermission]

  if (interopServices.excel) {
    epics.push(publishBlotterToExcelEpic)
  }

  if (interopServices.notificationHighlight) {
    epics.push(blotterHighlightEpic)
  }

  return combineEpics(...epics)
}
