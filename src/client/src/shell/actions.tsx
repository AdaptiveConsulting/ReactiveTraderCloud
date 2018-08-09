import { action } from 'rt-util'

export enum SHELL_ACTION_TYPES {
  OPEN_LINK = '@ReactiveTraderCloud/OPEN_LINK'
}

export const ShellActions = {
  openLink: action<SHELL_ACTION_TYPES.OPEN_LINK, string>(SHELL_ACTION_TYPES.OPEN_LINK)
}
