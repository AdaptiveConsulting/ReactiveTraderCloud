import './globals'
import baseStyled, { ThemedStyledInterface } from 'styled-components'

import { Theme } from './createTheme'
export const styled = baseStyled as ThemedStyledInterface<Theme>

export { ThemeName as TestThemeName, ThemeProvider as TestThemeProvider } from './ThemeStorage'
export { themes as testThemes } from './themes'
