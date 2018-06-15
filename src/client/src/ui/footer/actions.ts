import { action, ActionUnion } from '../../ActionHelper'

export enum ACTION_TYPES {
  TOGGLE_STATUS_SERVICES = '@ReactiveTraderCloud/TOGGLE_STATUS_SERVICES'
}

export const FooterActions = {
  toggleStatusServices: action<typeof ACTION_TYPES.TOGGLE_STATUS_SERVICES>(ACTION_TYPES.TOGGLE_STATUS_SERVICES)
}

export type FooterActions = ActionUnion<typeof FooterActions>
