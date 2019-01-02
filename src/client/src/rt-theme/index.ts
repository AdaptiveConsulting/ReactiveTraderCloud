export { default as GlobalStyle } from './globals'
import baseStyled, { ThemedStyledInterface } from 'styled-components'
export { colors, CorePalette, CorePaletteMap, ColorPalette, ColorPaletteMaps } from './colors'

import { Theme } from './createTheme'
export { Theme }
export const styled: ThemedStyledInterface<Theme> = baseStyled

export { ThemeName, ThemeProvider, ThemeConsumer } from './ThemeContext'
export { themes } from './themes'
export { resolvesColor } from './resolvesColor'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'
