// @ts-ignore
import React, { lazy, Suspense } from 'react'
import { ThemeStorage, styled } from 'rt-theme'

const StyleguideRoute = lazy(() => import('./StyleguideRoute'))

const Fallback = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${p => p.theme.shell.backgroundColor};
`

export default function StyleguideRouteLoader() {
  return (
    <ThemeStorage.Provider storage={sessionStorage}>
      <Suspense fallback={<Fallback />}>
        <StyleguideRoute />
      </Suspense>
    </ThemeStorage.Provider>
  )
}
export { StyleguideRouteLoader as StyleguideRoute }
