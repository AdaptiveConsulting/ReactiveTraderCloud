import './globals'
import baseStyled, { ThemedStyledInterface } from 'styled-components'

import { Theme } from './createTheme'
export const testStyled = baseStyled as ThemedStyledInterface<Theme>

export { ThemeName as TestThemeName, ThemeProvider as TestThemeProvider } from './ThemeStorage'
export { themes as testThemes } from './themes'
