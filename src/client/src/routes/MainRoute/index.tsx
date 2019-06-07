import React from 'react'

import { ThemeProvider } from 'rt-theme'
import MainRoute, { APPLICATION_DISCONNECT_MINS } from './MainRoute'

export default function MainRouteLoader() {
  return (
    <ThemeProvider>
      <MainRoute />
    </ThemeProvider>
  )
}
export { MainRouteLoader as MainRoute, APPLICATION_DISCONNECT_MINS }
