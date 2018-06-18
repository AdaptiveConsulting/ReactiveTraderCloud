import * as React from 'react'
import { Provider } from 'react-redux'
import { Action } from 'redux'
import { combineEpics, ofType, StateObservable } from 'redux-observable'
import { map, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { GlobalState } from '../../../combineReducers'
import { OpenFin } from '../../../services'
import { ACTION_TYPES as TILE_ACTIONS, SpotTileActions } from '../../spotTile/actions'
import { ACTION_TYPES as REGIONS_ACTIONS, RegionActions } from '../regions'
import { getPopoutService } from './index'

declare const window: any

const { popoutClosed, popoutOpened, openWindow } = RegionActions
const { undockTile, tileUndocked } = SpotTileActions
type OpenWindowAction = ReturnType<typeof openWindow>
type UndockAction = ReturnType<typeof undockTile>

const generateView = (container: React.ComponentClass<{}>) => {
  const childComponent = React.isValidElement(container) ? container : React.createElement(container)
  return React.createElement(Provider, { store: window.store }, childComponent)
}

const popoutWindowEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, OpenWindowAction>(REGIONS_ACTIONS.REGION_OPEN_WINDOW),
    map(action => popout(openFin, action, state$))
  )

const undockTileEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, UndockAction>(TILE_ACTIONS.UNDOCK_TILE),
    tap(action => {
      const popoutService = getPopoutService(openFin)
      popoutService.undockPopout(action.payload)
    }),
    map(tileUndocked)
  )

const popout = (openFin: OpenFin, action: OpenWindowAction, state$: StateObservable<GlobalState>) => {
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

export const popoutEpic = combineEpics(popoutWindowEpic, undockTileEpic)
