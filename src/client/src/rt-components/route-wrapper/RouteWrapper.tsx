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

const RouteWrapper: React.FC = ({ children }) => {
  const platform = usePlatform()

  return (
    <RouteStyle platform={platform}>
      {platform.name === 'openfin' ? (
        <OpenFinChrome>
          <OpenFinHeader close={platform.window.close} />
          {children}
        </OpenFinChrome>
      ) : (
        children
      )}
    </RouteStyle>
  )
}

export { RouteStyle, RouteWrapper }
