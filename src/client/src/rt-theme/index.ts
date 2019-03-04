import { Color, colors, LightShade, DarkShade, ColorPalette, AccentName, AccentPaletteMap } from './colors'
export { colors }
export type LightShade = LightShade
export type DarkShade = DarkShade
export type ColorPalette = ColorPalette
export type AccentName = AccentName
export type AccentPaletteMap = AccentPaletteMap
export type Color = Color
// export type CorePalette = CorePalette
// export type CorePaletteMap = CorePaletteMap
// export type ColorPaletteMaps = ColorPaletteMaps
export { default as GlobalStyle } from './globals'
import baseStyled, { ThemedStyledInterface } from 'styled-components'

export const styled: ThemedStyledInterface<Theme> = baseStyled

export { ThemeName, ThemeProvider, ThemeConsumer } from './ThemeContext'
import { Theme, ThemeSelector, themes } from './themes'
export type Theme = Theme
export type ThemeSelector = ThemeSelector
export { themes }
export { resolvesColor, getColor } from './resolvesColor'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'

// @ts-ignore
window.themes = themes
// @ts-ignore
window.colors = colors
