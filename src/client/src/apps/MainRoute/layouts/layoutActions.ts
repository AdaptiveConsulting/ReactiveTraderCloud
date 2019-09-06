import { action, ActionUnion } from 'rt-util'

export interface ContainerVisibility {
  name?: string
  display?: boolean
  x?: number
  y?: number
}

export enum LAYOUT_ACTION_TYPES {
  SETUP = '@ReactiveTraderCloud/SETUP',
  CONTAINER_VISIBILITY_UPDATE = '@ReactiveTraderCloud/CONTAINER_VISIBILITY_UPDATE',
}

export const LayoutActions = {
  setup: action<LAYOUT_ACTION_TYPES.SETUP>(LAYOUT_ACTION_TYPES.SETUP),
  updateContainerVisibilityAction: action<
    LAYOUT_ACTION_TYPES.CONTAINER_VISIBILITY_UPDATE,
    ContainerVisibility
  >(LAYOUT_ACTION_TYPES.CONTAINER_VISIBILITY_UPDATE),
}

export type SetupAction = ReturnType<typeof LayoutActions.setup>
export type LayoutActions = ActionUnion<typeof LayoutActions>
