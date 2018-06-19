import { action, ActionUnion } from '../../ActionHelper'
import { ServiceConnectionInfo } from '../../system'

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const CompositeStatusServiceActions = {
  createCompositeStatusServiceAction: action<typeof ACTION_TYPES.COMPOSITE_STATUS_SERVICE, ServiceConnectionInfo>(
    ACTION_TYPES.COMPOSITE_STATUS_SERVICE
  )
}

export type CompositeStatusServiceActions = ActionUnion<typeof CompositeStatusServiceActions>
