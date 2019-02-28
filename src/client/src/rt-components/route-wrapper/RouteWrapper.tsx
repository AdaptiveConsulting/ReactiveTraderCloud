import React from 'react'
import { OpenFinChrome, OpenFinHeader } from 'rt-components'
import { styled } from 'rt-theme'
import { usePlatform } from 'rt-components'

const RouteStyle = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const RouteWrapper: React.FC = ({ children }) => {
  const platform = usePlatform()

  return (
    <RouteStyle>
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
