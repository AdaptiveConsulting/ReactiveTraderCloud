import * as React from 'react'
import { Provider } from 'react-redux'
import { StateObservable } from 'redux-observable'

import { GlobalState } from '../../combineReducers'
import { OpenWindowAction, UndockAction } from '../../ui/common/popout/popoutEpic'
import { RegionActions } from '../../ui/common/regions'
import { PopoutService } from './types'

const { popoutClosed, popoutOpened } = RegionActions

declare const window: any

export const createPopout = (
  action: OpenWindowAction,
  state$: StateObservable<GlobalState>,
  popoutService: PopoutService
) => {
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

const generateView = (container: React.ComponentClass<{}>) => {
  const childComponent = React.isValidElement(container) ? container : React.createElement(container)
  return React.createElement(Provider, { store: window.store }, childComponent)
}

export function undockPopout(action: UndockAction, popoutService: PopoutService) {
  popoutService.undockPopout(action.payload)
}
