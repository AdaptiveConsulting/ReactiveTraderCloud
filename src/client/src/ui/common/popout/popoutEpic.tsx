import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { map, skipWhile, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES as TILE_ACTIONS, SpotTileActions } from '../../spotTile/actions'
import { ACTION_TYPES as REGIONS_ACTIONS, RegionActions } from '../regions'
import { createPopout, undockPopout } from './popoutUtils'

const { openWindow } = RegionActions
const { undockTile, tileUndocked } = SpotTileActions
export type OpenWindowAction = ReturnType<typeof openWindow>
export type UndockAction = ReturnType<typeof undockTile>

const popoutWindowEpic: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, OpenWindowAction>(REGIONS_ACTIONS.REGION_OPEN_WINDOW),
    skipWhile(() => state$.value.environment.isRunningOnDesktop),
    map(action => createPopout(action, state$))
  )

const undockTileEpic: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, UndockAction>(TILE_ACTIONS.UNDOCK_TILE),
    skipWhile(() => state$.value.environment.isRunningOnDesktop),
    tap(action => undockPopout(action)),
    map(tileUndocked)
  )

export const popoutEpic = combineEpics(popoutWindowEpic, undockTileEpic)
