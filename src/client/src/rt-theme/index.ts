import { colors, AccentName, AccentPaletteMap } from './colors'
export { colors }
export type AccentName = AccentName
export type AccentPaletteMap = AccentPaletteMap
// export type CorePalette = CorePalette
// export type CorePaletteMap = CorePaletteMap
// export type ColorPalette = ColorPalette
// export type ColorPaletteMaps = ColorPaletteMaps
export { default as GlobalStyle } from './globals'
import baseStyled, { ThemedStyledInterface } from 'styled-components'

import { Theme } from './createTheme'
export type Theme = Theme
export const styled: ThemedStyledInterface<Theme> = baseStyled

export { ThemeName, ThemeProvider, ThemeConsumer } from './ThemeContext'
import { themes } from './themes'
export { themes }
export { resolvesColor } from './resolvesColor'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'

// @ts-ignore
window.themes = themes
// @ts-ignore
window.colors = colors
