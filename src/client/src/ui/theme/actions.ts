import { action, ActionUnion } from '../../ActionHelper'

export enum ACTION_TYPES {
  TOGGLE_THEME = '@ReactiveTraderCloud/TOGGLE_THEME'
}

export const ThemeActions = {
  toggleTheme: action<ACTION_TYPES.TOGGLE_THEME>(ACTION_TYPES.TOGGLE_THEME)
}

export type ThemeActions = ActionUnion<typeof ThemeActions>
