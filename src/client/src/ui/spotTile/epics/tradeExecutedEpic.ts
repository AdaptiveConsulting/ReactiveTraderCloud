import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { TILE_ACTION_TYPES } from '../actions'
import { ExecutedTradeAction } from './spotTileEpics'

export const connectTradeExecutedToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, ExecutedTradeAction>(TILE_ACTION_TYPES.TRADE_EXECUTED),
    tap(
      (action: ExecutedTradeAction) =>
        action.meta && openFin.sendPositionClosedNotification(action.meta.uuid, action.meta.correlationId)
    ),
    ignoreElements()
  )
