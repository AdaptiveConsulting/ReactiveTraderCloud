import React from 'react'
import { EnvironmentValue, OpenFinChrome, OpenFinHeader, withEnvironment } from 'rt-components'
import { styled } from 'rt-theme'

const RouteStyle = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const closeOpenFinWindow = () => {
  fin.desktop.Window.getCurrent().close()
}

interface Props {
  environment: EnvironmentValue
}

const RouteWrapperBase: React.SFC<Props> = ({ environment, children }) => (
  <RouteStyle>
    {environment.provider.platform === 'openfin' ? (
      <OpenFinChrome>
        <OpenFinHeader close={closeOpenFinWindow} />
        {children}
      </OpenFinChrome>
    ) : (
      children
    )}
  </RouteStyle>
)

const RouteWrapper = withEnvironment(RouteWrapperBase)

export { RouteStyle, RouteWrapper }
