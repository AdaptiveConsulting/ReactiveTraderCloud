import { action, ActionUnion } from '../../ActionHelper'
import { CurrencyPairMap } from '../../types/currencyPair'

export enum ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE'
}

export const ReferenceActions = {
  createReferenceServiceAction: action<ACTION_TYPES.REFERENCE_SERVICE, CurrencyPairMap>(ACTION_TYPES.REFERENCE_SERVICE)
}

export type ReferenceActions = ActionUnion<typeof ReferenceActions>
