import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { delay, filter, map, mergeMap, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions, TILE_ACTION_TYPES } from '../actions'
import { concat, from, Observable, of, timer } from 'rxjs'
import { RfqReceived, RfqRequest } from '../model/rfqRequest'
import { SpotTileState } from '../spotTileReducer'
import { CurrencyPairState } from '../../../data/referenceData'
import { getDefaultNotionalValue } from '../components/Tile/TileBusinessLogic'

const {
  rfqRequest,
  rfqReceived,
  rfqExpired,
  rfqReject,
  rfqCancel,
  rfqReset,
  rfqRequote,
  setNotional,
  setTradingMode,
} = SpotTileActions

type RfqRequestActionType = ReturnType<typeof rfqRequest>
type RfqReceivedActionType = ReturnType<typeof rfqReceived>
type RfqRejectActionType = ReturnType<typeof rfqReject>
type RfqExpiredActionType = ReturnType<typeof rfqExpired>
type RfqCancelActionType = ReturnType<typeof rfqCancel>
type RfqResetActionType = ReturnType<typeof rfqReset>
type RfqReceivedTimerCancellableType =
  | RfqRejectActionType
  | RfqExpiredActionType
  | RfqResetActionType
  | RfqCancelActionType
type RfqRequoteActionType = ReturnType<typeof rfqRequote>

const EXPIRATION_TIMEOUT_MS = 10000
export const IDLE_TIME_MS = 60000

const rfqService = (
  request: RfqRequest,
  currencyPairs: CurrencyPairState,
  spotTilesData: SpotTileState,
): Observable<RfqReceived> => {
  const randomNumber = 0.3
  const { pipsPosition } = currencyPairs[request.currencyPair.symbol]
  const currentEspPrice = spotTilesData[request.currencyPair.symbol].price
  const { ask, bid } = currentEspPrice
  const addSubNumber = randomNumber / Math.pow(10, pipsPosition)

  return of(true).pipe(
    delay(500),
    map(() => ({
      notional: request.notional,
      currencyPair: request.currencyPair,
      price: {
        ...currentEspPrice,
        ask: ask + addSubNumber,
        bid: bid - addSubNumber,
      },
      time: Date.now(),
      timeout: EXPIRATION_TIMEOUT_MS,
    })),
  )
}

export const rfqRequestEpic: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, RfqRequestActionType | RfqRequoteActionType>(
      TILE_ACTION_TYPES.RFQ_REQUEST,
      TILE_ACTION_TYPES.RFQ_REQUOTE,
    ),
    mergeMap(action => {
      const cancel$ = action$.pipe(
        ofType<Action, RfqCancelActionType | RfqRejectActionType>(
          TILE_ACTION_TYPES.RFQ_CANCEL,
          TILE_ACTION_TYPES.RFQ_REJECT,
        ),
        filter(
          cancelAction =>
            cancelAction.payload.currencyPair.symbol === action.payload.currencyPair.symbol,
        ),
      )

      // TODO Subscribe to Pricing service instead of passing the current price
      // to that call? Same with currencyPairs?
      return rfqService(
        action.payload,
        state$.value.currencyPairs,
        state$.value.spotTilesData,
      ).pipe(
        map(rfqReceived),
        takeUntil(cancel$),
      )
    }),
  )

export const rfqReceivedEpic: ApplicationEpic = action$ =>
  action$.pipe(
    ofType<Action, RfqReceivedActionType>(TILE_ACTION_TYPES.RFQ_RECEIVED),
    mergeMap(action => {
      const { currencyPair } = action.payload
      const cancel$ = action$.pipe(
        ofType<Action, RfqReceivedTimerCancellableType>(
          TILE_ACTION_TYPES.RFQ_RESET,
          TILE_ACTION_TYPES.RFQ_CANCEL,
          TILE_ACTION_TYPES.RFQ_REJECT,
        ),
        filter(cancelAction => cancelAction.payload.currencyPair.symbol === currencyPair.symbol),
      )

      return concat(
        timer(action.payload.timeout + 1000).pipe(map(() => rfqExpired({ currencyPair }))),
        timer(IDLE_TIME_MS).pipe(
          mergeMap(() =>
            from([
              setNotional({
                currencyPair: currencyPair.symbol,
                notional: getDefaultNotionalValue(),
              }),
              setTradingMode({
                symbol: currencyPair.symbol,
                mode: 'esp',
              }),
              rfqReset({ currencyPair }),
            ]),
          ),
        ),
      ).pipe(takeUntil(cancel$))
    }),
  )
