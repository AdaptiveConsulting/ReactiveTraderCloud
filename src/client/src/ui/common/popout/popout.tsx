import { StateObservable } from 'redux-observable'
import { GlobalState } from '../../../combineReducers'
import { OpenFin } from '../../../services'
import { getPopoutService } from './index'
import { generateView, OpenWindowAction } from './popoutEpic'
export const popout = (openFin: OpenFin, action: OpenWindowAction, state$: StateObservable<GlobalState>) => {
  const popoutService = getPopoutService(openFin)
  const { id, container, settings } = action.payload
  const popoutView = generateView(container)
  popoutService.openPopout(
    {
      id,
      url: '/#/popout',
      title: settings.title,
      onClosing: () => {
        state$.dispatch(popoutClosed(action.payload))
      },
      windowOptions: {
        width: settings.width,
        height: settings.height,
        minWidth: 100,
        minHeight: settings.minHeight,
        resizable: settings.resizable,
        scrollable: settings.resizable,
        dockable: settings.dockable
      }
    },
    popoutView
  )
  return popoutOpened(action.payload)
}
