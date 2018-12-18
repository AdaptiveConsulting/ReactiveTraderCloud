// @ts-ignore
import React, { lazy, Suspense } from 'react'

import { styled, TestThemeProvider } from 'test-theme'

const MainRoute = lazy(() => import('./MainRoute'))

const Fallback = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${p => p.theme.component.backgroundColor};
`

export default function MainRouteLoader() {
  return (
    <TestThemeProvider>
      <Suspense fallback={<Fallback />}>
        <MainRoute />
      </Suspense>
    </TestThemeProvider>
  )
}
export { MainRouteLoader as MainRoute }
