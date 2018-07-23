import { SpotPriceTick } from 'common/types'
import { action, ActionUnion } from '../../ActionHelper'

export enum ACTION_TYPES {
  SPOT_PRICES_UPDATE = '@ReactiveTraderCloud/SPOT_PRICES_UPDATE'
}

export const PricingActions = {
  priceUpdateAction: action<ACTION_TYPES.SPOT_PRICES_UPDATE, SpotPriceTick>(ACTION_TYPES.SPOT_PRICES_UPDATE)
}

export type PricingActions = ActionUnion<typeof PricingActions>
