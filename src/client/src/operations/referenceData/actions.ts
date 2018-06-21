import { action, ActionUnion } from '../../ActionHelper'
import { CurrencyPair } from '../../types'

export enum ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE'
}

export const ReferenceActions = {
  createReferenceServiceAction: action<ACTION_TYPES.REFERENCE_SERVICE, Map<string, CurrencyPair>>(
    ACTION_TYPES.REFERENCE_SERVICE
  )
}

export type ReferenceActions = ActionUnion<typeof ReferenceActions>
