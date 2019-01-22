import React from 'react'
import { ThemeProvider } from 'rt-theme'
import StyleguideRoute from './StyleguideRoute'

export default function StyleguideRouteLoader() {
  return (
    <ThemeProvider storage={sessionStorage}>
      <StyleguideRoute />
    </ThemeProvider>
  )
}
export { StyleguideRouteLoader as StyleguideRoute }
