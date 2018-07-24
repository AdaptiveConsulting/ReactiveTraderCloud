import { CurrencyPairMap } from 'rt-types'
import { action, ActionUnion } from '../../ActionHelper'

export enum ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE'
}

export const ReferenceActions = {
  createReferenceServiceAction: action<ACTION_TYPES.REFERENCE_SERVICE, CurrencyPairMap>(ACTION_TYPES.REFERENCE_SERVICE)
}

export type ReferenceActions = ActionUnion<typeof ReferenceActions>
