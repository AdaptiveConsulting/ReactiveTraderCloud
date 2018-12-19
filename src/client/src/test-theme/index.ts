import './globals'
import baseStyled, { ThemedStyledInterface } from 'styled-components'
export { colors, CorePalette, CorePaletteMap, ColorPalette, ColorPaletteMaps } from './colors'

import { Theme } from './createTheme'
export { Theme }
export const styled = baseStyled as ThemedStyledInterface<Theme>

export { ThemeName, ThemeProvider as TestThemeProvider, ThemeConsumer as TestThemeConsumer } from './ThemeStorage'
export { themes as testThemes } from './themes'
export { resolvesColor } from './resolvesColor'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'
