import baseStyled, { ThemedStyledInterface } from 'styled-components'
import * as colorsLib from './colors'
import * as themesLib from './themes'
export const { colors } = colorsLib
export type LightShade = colorsLib.LightShade
export type DarkShade = colorsLib.DarkShade
export type ColorPalette = colorsLib.ColorPalette
export type AccentName = colorsLib.AccentName
export type AccentPaletteMap = colorsLib.AccentPaletteMap
export type Color = colorsLib.Color
export { default as GlobalStyle } from './globals'

export const styled: ThemedStyledInterface<Theme> = baseStyled

export { ThemeName, ThemeProvider, ThemeConsumer, useTheme } from './ThemeContext'
export type Theme = themesLib.Theme
export type TouchableIntentName = themesLib.TouchableIntentName
export type ColorProps = themesLib.ColorProps
export type ThemeSelector = themesLib.ThemeSelector
export const { themes, getThemeColor } = themesLib
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'
