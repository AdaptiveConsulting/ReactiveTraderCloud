import { action, ActionUnion } from '../../ActionHelper'
import { SpotPriceTick } from '../../types'

export enum ACTION_TYPES {
  SPOT_PRICES_UPDATE = '@ReactiveTraderCloud/SPOT_PRICES_UPDATE'
}

export const PricingActions = {
  priceUpdateAction: action<ACTION_TYPES.SPOT_PRICES_UPDATE, SpotPriceTick>(ACTION_TYPES.SPOT_PRICES_UPDATE)
}

export type PricingActions = ActionUnion<typeof PricingActions>
