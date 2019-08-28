import React, { ReactNode } from 'react'
import { styled } from 'rt-theme'
import { usePlatform } from 'rt-components'
import { PlatformAdapter } from 'rt-components'

const RouteStyle = styled('div')<{ platform: PlatformAdapter }>`
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;

  /* When in Finsemble a 25px header is injected,
   this resets body to the correct height */
  height: ${({ platform: { name } }) => (name === 'finsemble' ? 'calc(100% - 25px)' : '100%')};
`

export type WindowRole = 'main' | 'sub'

export interface RouteWrapperProps {
  children: ReactNode
  windowType?: WindowRole
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ children, windowType = 'main' }) => {
  const platform = usePlatform()
  const { PlatformRoute } = platform
  const props = { windowType }

  return (
    <RouteStyle platform={platform}>
      <PlatformRoute {...props}>{children}</PlatformRoute>
    </RouteStyle>
  )
}

export { RouteStyle, RouteWrapper }
