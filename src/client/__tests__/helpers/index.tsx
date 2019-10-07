import React from 'react'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { themes } from '../../src/rt-theme'
import { Browser, PlatformProvider } from 'rt-platforms'

const lightTheme = themes.light
const darkTheme = themes.dark

export function renderWithProviders(component: JSX.Element, theme?: 'light' | 'dark') {
  const platform = new Browser()
  return renderer.create(
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <PlatformProvider value={platform}>{component}</PlatformProvider>
    </ThemeProvider>,
  )
}
