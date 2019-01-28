import { colors, CorePalette, CorePaletteMap, ColorPalette, ColorPaletteMaps } from './colors'
export { colors }
export type CorePalette = CorePalette
export type CorePaletteMap = CorePaletteMap
export type ColorPalette = ColorPalette
export type ColorPaletteMaps = ColorPaletteMaps
export { default as GlobalStyle } from './globals'
import baseStyled, { ThemedStyledInterface } from 'styled-components'

import { Theme } from './createTheme'
export type Theme = Theme
export const styled: ThemedStyledInterface<Theme> = baseStyled

export { ThemeName, ThemeProvider, ThemeConsumer } from './ThemeContext'
export { themes } from './themes'
export { resolvesColor } from './resolvesColor'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'
