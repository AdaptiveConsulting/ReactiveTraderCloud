import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { delay, map, takeUntil, mergeMap, filter } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { TILE_ACTION_TYPES, SpotTileActions } from '../actions'
import { of, timer } from 'rxjs'
import { RfqRequest } from '../model/rfqRequest'
import { SpotTileState } from '../spotTileReducer'
import { CurrencyPairState } from '../../../../src/shell/referenceData'

const { rfqRequest, rfqReceived, rfqExpired, rfqReject, rfqCancel } = SpotTileActions

type RfqRequestActionType = ReturnType<typeof rfqRequest>
type RfqReceivedActionType = ReturnType<typeof rfqReceived>
type RfqRejectActionType = ReturnType<typeof rfqReject>
type RfqExpiredActionType = ReturnType<typeof rfqExpired>
type RfqCancelActionType = ReturnType<typeof rfqCancel>

const EXPIRATION_TIMEOUT_MS = 60000

const fakeAjaxCall = (
  r: RfqRequest,
  currencyPairs: CurrencyPairState,
  spotTilesData: SpotTileState,
) => {
  // TODO manipulate the prices relative using currencyPairData and randomNumber
  // const randomNumber = Math.random() * (3 - 0)
  // const currencyPairData = currencyPairs[r.currencyPair.symbol]
  const currentEspPrice = spotTilesData[r.currencyPair.symbol].price

  return of({
    notional: r.notional,
    currencyPair: r.currencyPair,
    price: {
      ...currentEspPrice,
      // TODO manipulated price data goes here.
    },
    timeout: EXPIRATION_TIMEOUT_MS,
  }).pipe(delay(Math.random() * (10000 - 0)))
}

const fetchRfqQuote = (payload: RfqRequest) => ({
  type: TILE_ACTION_TYPES.RFQ_RECEIVED,
  payload,
})

export const rfqRequestEpic: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, RfqRequestActionType>(TILE_ACTION_TYPES.RFQ_REQUEST),
    mergeMap(action =>
      // TODO Subcribe to Pricing service instead of passing the current price
      // to that call? Same with currencuPairs?
      fakeAjaxCall(action.payload, state$.value.currencyPairs, state$.value.spotTilesData).pipe(
        map(response => fetchRfqQuote(response)),
        takeUntil(action$.pipe(ofType<Action, RfqCancelActionType>(TILE_ACTION_TYPES.RFQ_CANCEL))),
      ),
    ),
  )

export const rfqReceivedEpic: ApplicationEpic = action$ =>
  action$.pipe(
    ofType<Action, RfqReceivedActionType>(TILE_ACTION_TYPES.RFQ_RECEIVED),
    mergeMap(action => {
      const cancel$ = action$.pipe(
        ofType<Action, RfqRejectActionType | RfqExpiredActionType>(
          TILE_ACTION_TYPES.RFQ_REJECT,
          TILE_ACTION_TYPES.RFQ_EXPIRED,
        ),
        filter(
          cancelAction =>
            cancelAction.payload.currencyPair.symbol === action.payload.currencyPair.symbol,
        ),
      )

      return timer(action.payload.timeout).pipe(
        takeUntil(cancel$),
        map(() => rfqExpired({ currencyPair: action.payload.currencyPair })),
      )
    }),
  )
