import { Theme } from './themes'
import baseStyled, { ThemedStyledInterface } from 'styled-components'
export * from './colors'
export * from './themes'
export * from './themes'
export { colors } from './colors'
export { default as GlobalStyle } from './globals'

export const styled: ThemedStyledInterface<Theme> = baseStyled

export { ThemeName, ThemeProvider, ThemeConsumer, useTheme } from './ThemeContext'
export { default as ThemeStorageSwitch } from './ThemeStorageSwitch'
