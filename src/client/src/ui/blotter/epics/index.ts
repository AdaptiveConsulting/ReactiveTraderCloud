import { combineEpics } from 'redux-observable'
import { publishBlotterEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'
import { connectBlotterToNotifications, requestBrowserNotificationPermission } from './blotterServiceEpic'
import { ApplicationDependencies } from 'applicationServices'

export default ({ platform }: ApplicationDependencies) => {
  const interopServices = platform.interopServices
  const epics = [blotterServiceEpic, connectBlotterToNotifications, requestBrowserNotificationPermission]

  if (interopServices.excel) {
    epics.push(publishBlotterEpic)
  }

  return combineEpics(...epics)
}
