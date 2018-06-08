import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ActionUnion } from './ActionHelper'
import { action as createAction } from './ActionHelper'
import { ApplicationEpic } from './ApplicationEpic'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from './connectionActions'
import { SpotPriceTick } from './types'

const SPOT_PRICES_UPDATE = '@ReactiveTraderCloud/SPOT_PRICES_UPDATE'

export const PriceActions = {
  priceUpdateAction: createAction<typeof SPOT_PRICES_UPDATE, SpotPriceTick>(SPOT_PRICES_UPDATE)
}

export type PriceActions = ActionUnion<typeof PriceActions>

const updatePricesEpic: ApplicationEpic = (action$, store, { pricesForCurrenciesInRefData }) =>
  action$.pipe(
    ofType(CONNECT_SERVICES),
    switchMapTo(
      pricesForCurrenciesInRefData.pipe(
        map(PriceActions.priceUpdateAction),
        takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
      )
    )
  )

export const pricingServiceEpic = combineEpics(updatePricesEpic)

interface PricingOperationsState {
  readonly [symbol: string]: SpotPriceTick
}

export const initialState: PricingOperationsState = {}

export const pricingServiceReducer = (state = initialState, actions: Action) => {
  const action = actions as PriceActions
  switch (action.type) {
    case SPOT_PRICES_UPDATE:
      const { payload } = action
      return { ...state, [payload.symbol]: payload }
    default:
      return state
  }
}
