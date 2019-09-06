import React, { ReactNode } from 'react'
import { styled } from 'rt-theme'
import { usePlatform } from 'rt-components'
import { PlatformAdapter } from 'rt-components'

const RouteStyle = styled('div')<{ platform: PlatformAdapter }>`
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  /* When in Finsemble a 25px header is injected,
   this resets body to the correct height */
  height: ${({ platform: { style } }) => style.height};
`

type WindowRole = 'main' | 'sub'

interface RouteWrapperProps {
  children: ReactNode
  windowType?: WindowRole
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ children, windowType = 'main' }) => {
  const platform = usePlatform()
  const { PlatformHeader, PlatformControls, PlatformRoute, window } = platform
  const Header = windowType === 'main' ? PlatformControls : null
  const subheader = windowType === 'sub' ? <PlatformHeader close={window.close} /> : null

  return (
    <RouteStyle platform={platform}>
      <PlatformRoute>
        {subheader}
        {React.cloneElement(children as React.ReactElement, { header: <Header {...window} /> })}
      </PlatformRoute>
    </RouteStyle>
  )
}

export { RouteStyle, RouteWrapper }
