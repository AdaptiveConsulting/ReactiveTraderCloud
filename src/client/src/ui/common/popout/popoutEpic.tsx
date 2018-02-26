import * as React from 'react'
import { createAction } from 'redux-actions'
import { ACTION_TYPES as REGIONS_ACTIONS } from '../regions/regionsOperations'
import { ACTION_TYPES as TILE_ACTIONS, tileUndocked } from '../../spotTile/actions'
import { getPopoutService } from './index'
import { Provider } from 'react-redux'
import { combineEpics } from 'redux-observable'

declare const window: any

const popoutOpened = createAction(REGIONS_ACTIONS.REGION_TEAROFF_WINDOW, payload => payload)
const popoutClosed = createAction(REGIONS_ACTIONS.REGION_ATTACH_WINDOW, payload => payload)

const generateView = (container) => {
  const childComponent = React.isValidElement(container) ? container : React.createElement(container)
  return React.createElement(Provider, { store: window.store }, childComponent)
}

function popoutWindowEpic(action$, store) {
  return action$.ofType(REGIONS_ACTIONS.REGION_OPEN_WINDOW)
    .map((action) => {
      const popoutService = getPopoutService(action.payload.openFin)
      const { id, container, settings } = action.payload
      const popoutView = generateView(container)
      popoutService.openPopout(
        {
          id,
          url: '/#/popout',
          title: settings.title,
          onClosing: () => {
            store.dispatch(popoutClosed(action.payload))
          },
          windowOptions: {
            width: settings.width,
            height: settings.height,
            minWidth: 100,
            minHeight: settings.minHeight,
            resizable: settings.resizable,
            scrollable: settings.resizable,
            dockable: settings.dockable,
          },
        },
        popoutView,
      )
      return popoutOpened(action.payload)
    })
}

function undockTile(action$) {
  return action$.ofType(TILE_ACTIONS.UNDOCK_TILE)
    .map((action) => {
      const popoutService = getPopoutService(action.payload.openFin)
      popoutService.undockPopout(action.payload.tileName)
      return action
    })
    .map(tileUndocked)
}

export const popoutEpic = () => {
  return combineEpics(popoutWindowEpic, undockTile)
}
