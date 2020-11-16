import type { Theme } from './themes'
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
export { ThemeName, ThemeProvider, ThemeConsumer, useTheme } from './ThemeContext'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'

// Make all styled-component functions (e.g. `styled`, `css`) typed with Theme
// See https://github.com/styled-components/styled-components-website/issues/447
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
