import { action, ActionUnion } from '../../../ActionHelper'

export interface Region {
  id: string
  isTearedOff?: boolean
}

export enum ACTION_TYPES {
  REGION_ADD = '@ReactiveTraderCloud/REGION_ADD',
  REGION_OPEN_WINDOW = '@ReactiveTraderCloud/REGION_OPEN_WINDOW',
  REGION_TEAROFF_WINDOW = '@ReactiveTraderCloud/REGION_TEAROFF_WINDOW',
  REGION_ATTACH_WINDOW = '@ReactiveTraderCloud/REGION_ATTACH_WINDOW'
}

export const RegionActions = {
  openWindow: action<ACTION_TYPES.REGION_OPEN_WINDOW, Region>(ACTION_TYPES.REGION_OPEN_WINDOW),
  addRegion: action<ACTION_TYPES.REGION_ADD, Region>(ACTION_TYPES.REGION_ADD),
  popoutOpened: action<ACTION_TYPES.REGION_TEAROFF_WINDOW, Region>(ACTION_TYPES.REGION_TEAROFF_WINDOW),
  popoutClosed: action<ACTION_TYPES.REGION_ATTACH_WINDOW, Region>(ACTION_TYPES.REGION_ATTACH_WINDOW)
}

export type RegionActions = ActionUnion<typeof RegionActions>
