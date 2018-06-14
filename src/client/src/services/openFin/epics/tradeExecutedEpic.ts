import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES, ExecutedTradeAction } from '../../../ui/spotTile'

export const connectTradeExecutedToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, ExecutedTradeAction>(ACTION_TYPES.TRADE_EXECUTED),
    tap(
      (action: ExecutedTradeAction) =>
        action.meta && openFin.sendPositionClosedNotification(action.meta.uuid, action.meta.correlationId)
    ),
    ignoreElements()
  )
