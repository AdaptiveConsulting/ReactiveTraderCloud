import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { delay, map, takeUntil, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { TILE_ACTION_TYPES, SpotTileActions } from '../actions'
import { of } from 'rxjs'
import { RfqRequest } from '../model/rfqRequest'

const { rfqRequest, /*rfqReceived, rfqExpired,*/ rfqCancel } = SpotTileActions

type RfqRequestActionType = ReturnType<typeof rfqRequest>
// type RfqReceivedActionType = ReturnType<typeof rfqReceived>
// type RfqExpiredActionType = ReturnType<typeof rfqExpired>
type RfqCancelActionType = ReturnType<typeof rfqCancel>

const fakeAjax = (r: RfqRequest) =>
  of({
    notional: r.notional,
    currencyPair: r.currencyPair,
    price: Math.random() * (3 - 0),
  }).pipe(delay(Math.random() * (10000 - 0)))

const fetchRfqQuote = (payload: RfqRequest) => ({
  type: TILE_ACTION_TYPES.RFQ_RECEIVED,
  payload,
})

export const rfqRequestEpic: ApplicationEpic = action$ =>
  action$.pipe(
    ofType<Action, RfqRequestActionType>(TILE_ACTION_TYPES.RFQ_REQUEST),
    mergeMap(action =>
      fakeAjax(action.payload).pipe(
        map(response => fetchRfqQuote(response)),
        takeUntil(action$.pipe(ofType<Action, RfqCancelActionType>(TILE_ACTION_TYPES.RFQ_CANCEL))),
      ),
    ),
  )

// const updateTime = (time: any) => {
//   console.log('time', time)
// }

// export const rfqReceivedEpic: ApplicationEpic = action$ =>
//   action$.pipe(
//     ofType<Action, RfqReceivedActionType>(TILE_ACTION_TYPES.RFQ_RECEIVED),
//     switchMap((val) => interval(1000).pipe()),
//     takeUntil(action$.pipe(ofType<Action, RfqExpiredActionType>(TILE_ACTION_TYPES.RFQ_EXPIRED))),
//   )
