import type { Theme } from './themes'
import baseStyled, { ThemedStyledInterface } from 'styled-components'
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

export const styled: ThemedStyledInterface<Theme> = baseStyled

export { ThemeName, ThemeProvider, ThemeConsumer, useTheme } from './ThemeContext'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'
