import { action, ActionUnion } from '../../rt-util'

export interface ContainerVisibility {
  name: string
  display: boolean
  x?: number
  y?: number
}

export enum LAYOUT_ACTION_TYPES {
  CONTAINER_VISIBILITY_UPDATE = '@ReactiveTraderCloud/CONTAINER_VISIBILITY_UPDATE',
}

export const LayoutActions = {
  updateContainerVisibilityAction: action<
    LAYOUT_ACTION_TYPES.CONTAINER_VISIBILITY_UPDATE,
    ContainerVisibility
  >(LAYOUT_ACTION_TYPES.CONTAINER_VISIBILITY_UPDATE),
}

export type LayoutActions = ActionUnion<typeof LayoutActions>
