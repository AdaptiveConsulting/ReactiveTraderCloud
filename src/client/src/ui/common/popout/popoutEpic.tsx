import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { map, skipWhile, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { createPopout, undockPopout } from '../../../services/popout'
import { ACTION_TYPES as TILE_ACTIONS, SpotTileActions } from '../../spotTile/actions'
import { ACTION_TYPES as REGIONS_ACTIONS, RegionActions } from '../regions'

const { openWindow } = RegionActions
const { undockTile, tileUndocked } = SpotTileActions
export type OpenWindowAction = ReturnType<typeof openWindow>
export type UndockAction = ReturnType<typeof undockTile>

const popoutWindowEpic: ApplicationEpic = (action$, state$, { popoutService }) =>
  action$.pipe(
    ofType<Action, OpenWindowAction>(REGIONS_ACTIONS.REGION_OPEN_WINDOW),
    skipWhile(() => state$.value.environment.isRunningOnDesktop),
    map(action => createPopout(action, state$, popoutService))
  )

const undockTileEpic: ApplicationEpic = (action$, state$, { popoutService }) =>
  action$.pipe(
    ofType<Action, UndockAction>(TILE_ACTIONS.UNDOCK_TILE),
    skipWhile(() => state$.value.environment.isRunningOnDesktop),
    tap(action => undockPopout(action, popoutService)),
    map(tileUndocked)
  )

export const popoutEpic = combineEpics(popoutWindowEpic, undockTileEpic)
