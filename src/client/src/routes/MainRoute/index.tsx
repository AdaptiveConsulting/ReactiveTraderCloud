// @ts-ignore
import React, { lazy, Suspense } from 'react'

import { styled, ThemeStorage } from 'rt-theme'

const MainRoute = lazy(() => import('./MainRoute'))

const Fallback = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${p => p.theme.component.backgroundColor};
`

export default function MainRouteLoader() {
  return (
    <ThemeStorage.Provider>
      <Suspense fallback={<Fallback />}>
        <MainRoute />
      </Suspense>
    </ThemeStorage.Provider>
  )
}
export { MainRouteLoader as MainRoute }
