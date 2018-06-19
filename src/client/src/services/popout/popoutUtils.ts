import * as React from 'react'
import { Provider } from 'react-redux'
import { StateObservable } from 'redux-observable'

import { GlobalState } from '../../combineReducers'
import { RegionActions } from '../../ui/common/regions'
import { Region } from '../../ui/common/regions/actions'
import { PopoutService } from './types'

const { popoutClosed, popoutOpened } = RegionActions

declare const window: any

export const createPopout = (region: Region, state$: StateObservable<GlobalState>, popoutService: PopoutService) => {
  const { id, container, settings } = region
  const popoutView = generateView(container)
  popoutService.openPopout(
    {
      id,
      url: '/#/popout',
      title: settings.title,
      onClosing: () => {
        state$.dispatch(popoutClosed(region))
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
  return popoutOpened(region)
}

const generateView = (container: React.ComponentClass<{}>) => {
  const childComponent = React.isValidElement(container) ? container : React.createElement(container)
  return React.createElement(Provider, { store: window.store }, childComponent)
}

export function undockPopout(windowName: string, popoutService: PopoutService) {
  popoutService.undockPopout(windowName)
}
