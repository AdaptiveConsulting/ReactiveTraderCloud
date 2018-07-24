import { DARK_THEME, LIGHT_THEME } from './constants'

export type ThemeType = typeof LIGHT_THEME | typeof DARK_THEME

export interface Props {
  type: ThemeType
}
