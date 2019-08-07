import baseStyled, { ThemedStyledInterface } from 'styled-components'
import {
  Color,
  colors,
  LightShade,
  DarkShade,
  ColorPalette,
  AccentName,
  AccentPaletteMap,
} from './colors'
import {
  Theme,
  ColorProps,
  ThemeSelector,
  TouchableIntentName,
  themes,
  getThemeColor,
} from './themes'
export { colors }
export type LightShade = LightShade
export type DarkShade = DarkShade
export type ColorPalette = ColorPalette
export type AccentName = AccentName
export type AccentPaletteMap = AccentPaletteMap
export type Color = Color
export { default as GlobalStyle } from './globals'

export const styled: ThemedStyledInterface<Theme> = baseStyled

export { ThemeName, ThemeProvider, ThemeConsumer, useTheme } from './ThemeContext'
export type Theme = Theme
export type TouchableIntentName = TouchableIntentName
export type ColorProps = ColorProps
export type ThemeSelector = ThemeSelector
export { themes, getThemeColor }
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'
