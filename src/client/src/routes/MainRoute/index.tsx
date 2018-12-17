// @ts-ignore
import React, { lazy, Suspense } from 'react'

import { styled, ThemeStorage } from 'rt-theme'
import { TestThemeProvider } from 'test-theme'

const MainRoute = lazy(() => import('./MainRoute'))

const Fallback = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${p => p.theme.component.backgroundColor};
`

export default function MainRouteLoader() {
  return (
    <TestThemeProvider>
      <ThemeStorage.Provider>
        <Suspense fallback={<Fallback />}>
          <MainRoute />
        </Suspense>
      </ThemeStorage.Provider>
    </TestThemeProvider>
  )
}
export { MainRouteLoader as MainRoute }
