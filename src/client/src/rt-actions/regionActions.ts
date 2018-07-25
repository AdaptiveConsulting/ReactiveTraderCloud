import { action, ActionUnion } from 'rt-util'

export interface Region {
  id: string
  isTearedOff?: boolean
}

export enum REGION_ACTION_TYPES {
  REGION_ADD = '@ReactiveTraderCloud/REGION_ADD',
  REGION_OPEN_WINDOW = '@ReactiveTraderCloud/REGION_OPEN_WINDOW',
  REGION_TEAROFF_WINDOW = '@ReactiveTraderCloud/REGION_TEAROFF_WINDOW',
  REGION_ATTACH_WINDOW = '@ReactiveTraderCloud/REGION_ATTACH_WINDOW'
}

export const RegionActions = {
  openWindow: action<REGION_ACTION_TYPES.REGION_OPEN_WINDOW, Region>(REGION_ACTION_TYPES.REGION_OPEN_WINDOW),
  addRegion: action<REGION_ACTION_TYPES.REGION_ADD, Region>(REGION_ACTION_TYPES.REGION_ADD),
  popoutOpened: action<REGION_ACTION_TYPES.REGION_TEAROFF_WINDOW, Region>(REGION_ACTION_TYPES.REGION_TEAROFF_WINDOW),
  popoutClosed: action<REGION_ACTION_TYPES.REGION_ATTACH_WINDOW, Region>(REGION_ACTION_TYPES.REGION_ATTACH_WINDOW)
}

export type RegionActions = ActionUnion<typeof RegionActions>
