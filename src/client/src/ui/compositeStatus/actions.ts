import { action, ActionUnion } from 'rt-util'
import { ServiceConnectionInfo } from '../../system'

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const CompositeStatusServiceActions = {
  createCompositeStatusServiceAction: action<ACTION_TYPES.COMPOSITE_STATUS_SERVICE, ServiceConnectionInfo>(
    ACTION_TYPES.COMPOSITE_STATUS_SERVICE
  )
}

export type CompositeStatusServiceActions = ActionUnion<typeof CompositeStatusServiceActions>
