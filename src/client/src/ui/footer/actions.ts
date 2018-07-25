import { action, ActionUnion } from 'rt-util'

export enum FOOTER_ACTION_TYPES {
  TOGGLE_STATUS_SERVICES = '@ReactiveTraderCloud/TOGGLE_STATUS_SERVICES',
  OPEN_LINK = '@ReactiveTraderCloud/OPEN_LINK'
}

export const FooterActions = {
  toggleStatusServices: action<FOOTER_ACTION_TYPES.TOGGLE_STATUS_SERVICES>(FOOTER_ACTION_TYPES.TOGGLE_STATUS_SERVICES),
  openLink: action<FOOTER_ACTION_TYPES.OPEN_LINK, string>(FOOTER_ACTION_TYPES.OPEN_LINK)
}

export type FooterActions = ActionUnion<typeof FooterActions>
