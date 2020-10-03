import type { Theme } from './themes'
import baseStyled from 'styled-components/macro'
export type {
  LightShade,
  DarkShade,
  ColorPalette,
  AccentName,
  AccentPaletteMap,
  Color,
} from './colors'
export { themes, getThemeColor } from './themes'
export type { Theme, TouchableIntentName, ColorProps, ThemeSelector } from './themes'
export { colors } from './colors'
export { default as GlobalStyle } from './globals'

// TEMP - remove once all imports migrated to 'styled-components/macro'
export const styled = baseStyled

// Make all styled-component functions (e.g. `styled`, `css`) typed with Theme
// See https://github.com/styled-components/styled-components-website/issues/447
declare module 'styled-components' {
  // tslint:disable-next-line:no-empty-interface
  export interface DefaultTheme extends Theme {}
}

export { ThemeName, ThemeProvider, ThemeConsumer, useTheme } from './ThemeContext'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'
