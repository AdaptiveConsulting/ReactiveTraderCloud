import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { TILE_ACTION_TYPES } from '../actions'
import { ExecutedTradeAction } from './spotTileEpics'
import { EMPTY } from 'rxjs'

export const publishTradeExecutedEpic: ApplicationEpic = (action$, state$, { platform }) => {
  if (!platform.hasFeature('interop')) {
    return EMPTY
  }
  return action$.pipe(
    ofType<Action, ExecutedTradeAction>(TILE_ACTION_TYPES.TRADE_EXECUTED),
    tap(
      (action: ExecutedTradeAction) =>
        action.meta && platform.interop.publish(action.meta.correlationId, null),
    ),
    ignoreElements(),
  )
}
