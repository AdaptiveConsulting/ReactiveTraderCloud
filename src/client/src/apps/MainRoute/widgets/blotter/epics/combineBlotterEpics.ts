import { combineEpics } from 'redux-observable'
import { blotterServiceEpic } from './epics'
import {
  connectBlotterToNotifications,
  publishBlotterToExcelEpic,
  requestBrowserNotificationPermission,
  removeHighlightTradeEpic
} from './blotterServiceEpic'
import { ApplicationDependencies } from 'apps/MainRoute/store/applicationServices'
import { blotterHighlightEpic } from './blotterHighlightEpic'
import { platformHasFeature } from 'rt-platforms'

export default ({ platform }: ApplicationDependencies) => {
  const epics = [
    blotterServiceEpic,
    connectBlotterToNotifications,
    requestBrowserNotificationPermission,
    publishBlotterToExcelEpic,
    removeHighlightTradeEpic
  ]

  if (platformHasFeature(platform, 'interop')) {
    epics.push(blotterHighlightEpic)
  }

  return combineEpics(...epics)
}
