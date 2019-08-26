import React from 'react'
import { OpenFinChrome, OpenFinHeader } from 'rt-components'
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
interface RouteWrapperProps {
  children: any
  extendedControls?: boolean
}
const RouteWrapper: React.FC<RouteWrapperProps> = ({ children, extendedControls }) => {
  const platform = usePlatform()
  const window = platform.window

  let header = extendedControls ? (
    <OpenFinHeader minimize={window.minimize} maximize={window.maximize} close={window.close} />
  ) : (
    <OpenFinHeader close={window.close} />
  )

  return (
    <RouteStyle platform={platform}>
      {platform.name === 'openfin' ? (
        <OpenFinChrome>
          {header}
          {children}
        </OpenFinChrome>
      ) : (
        children
      )}
    </RouteStyle>
  )
}

export { RouteStyle, RouteWrapper }
