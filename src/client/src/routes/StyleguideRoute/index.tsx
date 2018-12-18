// @ts-ignore
import React, { lazy, Suspense } from 'react'
import { TestThemeProvider, styled } from 'test-theme'

const StyleguideRoute = lazy(() => import('./StyleguideRoute'))

const Fallback = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${p => p.theme.shell.backgroundColor};
`

export default function StyleguideRouteLoader() {
  return (
    <TestThemeProvider storage={sessionStorage}>
      <Suspense fallback={<Fallback />}>
        <StyleguideRoute />
      </Suspense>
    </TestThemeProvider>
  )
}
export { StyleguideRouteLoader as StyleguideRoute }
