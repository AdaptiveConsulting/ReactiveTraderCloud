import { ServiceConnectionInfo } from 'rt-system'
import { action, ActionUnion } from 'rt-util'

export enum COMPOSITE_ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const CompositeStatusServiceActions = {
  createCompositeStatusServiceAction: action<COMPOSITE_ACTION_TYPES.COMPOSITE_STATUS_SERVICE, ServiceConnectionInfo>(
    COMPOSITE_ACTION_TYPES.COMPOSITE_STATUS_SERVICE
  )
}

export type CompositeStatusServiceActions = ActionUnion<typeof CompositeStatusServiceActions>
