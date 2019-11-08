import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { InteropTopics, platformHasFeature } from 'rt-platforms'
import { EMPTY } from 'rxjs'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'

import { TILE_ACTION_TYPES } from '../actions'
import { ExecutedTradeAction } from './spotTileEpics'

export const publishTradeExecutedEpic: ApplicationEpic = (action$, state$, { platform }) => {
  if (!platformHasFeature(platform, 'interop')) {
    return EMPTY
  }
  return action$.pipe(
    ofType<Action, ExecutedTradeAction>(TILE_ACTION_TYPES.TRADE_EXECUTED),
    tap((action: ExecutedTradeAction) => {
      if (action.meta) {
        platform.interop.publish(InteropTopics.PositionClosed, action.meta.correlationId)
      }
    }),
    ignoreElements(),
  )
}
