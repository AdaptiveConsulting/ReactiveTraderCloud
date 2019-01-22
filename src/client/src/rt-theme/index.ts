export { default as GlobalStyle } from './globals'
import baseStyled, { ThemedStyledInterface } from 'styled-components'
export * from './colors'

import { Theme } from './createTheme'
export * from './createTheme'
export const styled: ThemedStyledInterface<Theme> = baseStyled

export { ThemeName, ThemeProvider, ThemeConsumer } from './ThemeContext'
export { themes } from './themes'
export { resolvesColor } from './resolvesColor'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'
