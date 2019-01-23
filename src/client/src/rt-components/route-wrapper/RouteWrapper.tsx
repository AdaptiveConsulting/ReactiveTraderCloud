import React from 'react'
import { OpenFinChrome, OpenFinHeader, PlatformAdapter, withPlatform } from 'rt-components'
import styled from 'styled-components/macro'

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

interface Props {
  platform: PlatformAdapter
}

const RouteWrapperBase: React.SFC<Props> = ({ children, platform }) => (
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

const RouteWrapper = withPlatform(RouteWrapperBase)

export { RouteStyle, RouteWrapper }
