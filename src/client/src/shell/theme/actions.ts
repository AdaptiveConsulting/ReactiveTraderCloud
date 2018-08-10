import { action, ActionUnion } from 'rt-util/ActionHelper'

export enum THEME_ACTION_TYPES {
  TOGGLE_THEME = '@ReactiveTraderCloud/TOGGLE_THEME'
}

export const ThemeActions = {
  toggleTheme: action<THEME_ACTION_TYPES.TOGGLE_THEME>(THEME_ACTION_TYPES.TOGGLE_THEME)
}

export type ThemeActions = ActionUnion<typeof ThemeActions>
