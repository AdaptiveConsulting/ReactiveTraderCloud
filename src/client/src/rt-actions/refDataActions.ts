import { CurrencyPairMap } from 'rt-types'
import { action, ActionUnion } from 'rt-util'

export enum REF_ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE'
}

export const ReferenceActions = {
  createReferenceServiceAction: action<REF_ACTION_TYPES.REFERENCE_SERVICE, CurrencyPairMap>(
    REF_ACTION_TYPES.REFERENCE_SERVICE
  )
}

export type ReferenceActions = ActionUnion<typeof ReferenceActions>
