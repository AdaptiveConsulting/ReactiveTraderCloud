import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { delay, map, takeUntil, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { TILE_ACTION_TYPES, SpotTileActions } from '../actions'
import { of } from 'rxjs'
import { RfqRequest } from '../model/rfqRequest'

const { rfqRequest, rfqCancel } = SpotTileActions

type RfqRequestActionType = ReturnType<typeof rfqRequest>
type RfqCancelActionType = ReturnType<typeof rfqCancel>

const fakeAjax = (r: RfqRequest) =>
  of({
    notional: r.notional,
    currencyPair: r.currencyPair,
    price: Math.random() * (3 - 0),
  }).pipe(delay(Math.random() * (10000 - 0)))

const fetchUserFulfilled = (payload: RfqRequest) => ({
  type: TILE_ACTION_TYPES.RFQ_RECEIVED,
  payload,
})

export const rfqRequestEpic: ApplicationEpic = action$ =>
  action$.pipe(
    ofType<Action, RfqRequestActionType>(TILE_ACTION_TYPES.RFQ_REQUEST),
    mergeMap(action =>
      fakeAjax(action.payload).pipe(
        map(response => fetchUserFulfilled(response)),
        takeUntil(action$.pipe(ofType<Action, RfqCancelActionType>(TILE_ACTION_TYPES.RFQ_CANCEL))),
      ),
    ),
  )
