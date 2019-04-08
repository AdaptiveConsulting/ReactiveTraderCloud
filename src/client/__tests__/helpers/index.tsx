import React from 'react'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { themes } from '../../src/rt-theme'

const lightTheme = themes.light
const darkTheme = themes.dark

export function renderWithTheme(component: JSX.Element, theme?: 'light' | 'dark') {
  return renderer.create(
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>{component}</ThemeProvider>,
  )
}
