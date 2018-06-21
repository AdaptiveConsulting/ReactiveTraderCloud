import { action, ActionUnion } from '../../ActionHelper'

export enum ACTION_TYPES {
  TOGGLE_STATUS_SERVICES = '@ReactiveTraderCloud/TOGGLE_STATUS_SERVICES',
  OPEN_LINK = '@ReactiveTraderCloud/OPEN_LINK'
}

export const FooterActions = {
  toggleStatusServices: action<ACTION_TYPES.TOGGLE_STATUS_SERVICES>(ACTION_TYPES.TOGGLE_STATUS_SERVICES),
  openLink: action<ACTION_TYPES.OPEN_LINK, string>(ACTION_TYPES.OPEN_LINK)
}

export type FooterActions = ActionUnion<typeof FooterActions>
