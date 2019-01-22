import { combineEpics } from 'redux-observable'
import { publishBlotterEpic } from './blotterServiceEpic'
import { blotterServiceEpic } from './epics'
import { connectBlotterToNotifications, requestBrowserNotificationPermission } from './blotterServiceEpic'
import { InteropServices, PlatformAdapter } from 'rt-components'

export default ({ platform }: { platform: PlatformAdapter }) => {
  const { interopServices }: { interopServices: InteropServices } = platform
  const epics = [blotterServiceEpic, connectBlotterToNotifications, requestBrowserNotificationPermission]

  if (interopServices.excel) {
    epics.push(publishBlotterEpic)
  }

  return combineEpics(...epics)
}
